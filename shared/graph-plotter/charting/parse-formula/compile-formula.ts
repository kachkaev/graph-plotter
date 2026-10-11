import type { ErrorRange } from "../../shared/errors";
import type { Formula } from "../types";
import {
  type FormulaErrorCode,
  FormulaSyntaxError,
} from "./formula-syntax-error";
import { factorial, formulaConstants, formulaFunctions } from "./functions";
import { suggestFunctionName } from "./suggest-function-name";
import { type Operator, type Token, tokenize } from "./tokenize";

type BinaryOperation = (a: number, b: number) => number;

const comparisonOperations = new Map<Operator, BinaryOperation>([
  ["==", (a, b) => Number(a === b)],
  ["!=", (a, b) => Number(a !== b)],
  ["<", (a, b) => Number(a < b)],
  ["<=", (a, b) => Number(a <= b)],
  [">", (a, b) => Number(a > b)],
  [">=", (a, b) => Number(a >= b)],
]);

const additiveOperations = new Map<Operator, BinaryOperation>([
  ["+", (a, b) => a + b],
  ["-", (a, b) => a - b],
]);

const multiplicativeOperations = new Map<Operator, BinaryOperation>([
  ["*", (a, b) => a * b],
  ["/", (a, b) => a / b],
  ["%", (a, b) => a % b],
]);

const wordOperators = new Set(["and", "or"]);

/**
Operators and words like `and`, which need operands on both sides
*/
function isSign(token: Token | undefined): boolean {
  return (
    token?.type === "operator" ||
    (token?.type === "name" && wordOperators.has(token.value))
  );
}

function canStartOperand(token: Token): boolean {
  return (
    token.type === "number" ||
    token.type === "(" ||
    (token.type === "name" && !wordOperators.has(token.value)) ||
    (token.type === "operator" && ["-", "+"].includes(token.value))
  );
}

function getRange(token: Token): ErrorRange {
  return [token.start, token.end];
}

/**
 * Recursive descent parser that turns tokens into a function of x without
 * eval(). The grammar follows expr-eval, which the app used before, minus the
 * parts that do not produce numbers (strings, arrays, member access,
 * assignments). From the lowest to the highest precedence:
 *
 *   conditional    = or ["?" conditional ":" conditional]
 *   or             = and {"or" and}
 *   and            = comparison {"and" comparison}
 *   comparison     = additive {("==" | "!=" | "<" | "<=" | ">" | ">=") additive}
 *   additive       = multiplicative {("+" | "-") multiplicative}
 *   multiplicative = factor {("*" | "/" | "%") factor}
 *   factor         = ("-" | "+" | prefixFunction) factor | exponential
 *   exponential    = postfix {"^" factor}
 *   postfix        = atom {"!"}
 *   atom           = number | name | function "(" arguments ")" | "(" conditional ")"
 *
 * Prefix functions like `sin` can skip brackets around their argument, so
 * `sin x^2` means `sin(x^2)`, while `sin(x)^2` means `(sin x)^2`.
 *
 * Errors follow the Flash version of the app: each one has a code, the
 * fragment of the formula to highlight and sometimes a hint.
 */
class FormulaCompiler {
  readonly #rawFormula: string;
  readonly #tokens: Token[];
  readonly #endToken: Token;
  #tokenIndex = 0;

  constructor(rawFormula: string) {
    this.#rawFormula = rawFormula;
    this.#tokens = tokenize(rawFormula);
    this.#endToken = {
      type: "end",
      start: rawFormula.length,
      end: rawFormula.length,
    };
  }

  #peek(offset = 0): Token {
    return this.#tokens[this.#tokenIndex + offset] ?? this.#endToken;
  }

  #getText(token: Token): string {
    return this.#rawFormula.slice(token.start, token.end);
  }

  #fail(
    code: FormulaErrorCode,
    token: Token,
    subject: string | number = this.#getText(token),
  ): never {
    throw new FormulaSyntaxError(code, getRange(token), subject);
  }

  #checkBrackets() {
    const unclosedBrackets: Token[] = [];
    for (const [index, token] of this.#tokens.entries()) {
      const previousToken = this.#tokens[index - 1];
      if (token.type === "(") {
        if (previousToken?.type === ")") {
          this.#fail(22, token);
        }
        const nextToken = this.#tokens[index + 1];
        if (nextToken?.type === ")" && previousToken?.type !== "name") {
          throw new FormulaSyntaxError(23, [token.start, nextToken.end], "()");
        }
        unclosedBrackets.push(token);
      } else if (token.type === ")" && !unclosedBrackets.pop()) {
        this.#fail(20, token);
      }
    }

    if (unclosedBrackets.length > 0) {
      this.#fail(21, this.#endToken, unclosedBrackets.length);
    }
  }

  /**
  Called when `token` is in place of an operand, but cannot start one
  */
  #failMissingOperand(token: Token): never {
    const previousToken = this.#tokens[this.#tokenIndex - 1];

    if (!previousToken && token.type === "end") {
      throw new FormulaSyntaxError(1, [0, this.#rawFormula.length]);
    }

    if (isSign(token)) {
      const code = previousToken
        ? previousToken.type === "("
          ? 44
          : previousToken.type === ","
            ? 46
            : isSign(previousToken)
              ? 47
              : 40
        : 42;
      this.#fail(code, token);
    }

    if (previousToken && isSign(previousToken)) {
      const code =
        token.type === "end"
          ? 41
          : token.type === ")"
            ? 43
            : token.type === ","
              ? 45
              : 40;
      this.#fail(code, previousToken);
    }

    return this.#failUnexpectedToken(token);
  }

  /**
  Called when `token` follows a complete operand, but does not fit there
  */
  #failUnexpectedToken(token: Token): never {
    if (token.type === ",") {
      throw new FormulaSyntaxError(33, getRange(token), ",", [], "comma");
    }
    if (canStartOperand(token)) {
      this.#fail(38, token);
    }
    if (isSign(token)) {
      this.#fail(40, token);
    }

    return this.#fail(30, token);
  }

  #consumeClosingBracket() {
    const token = this.#peek();
    if (token.type !== ")") {
      this.#failUnexpectedToken(token);
    }
    this.#tokenIndex += 1;
  }

  #consumeOperator(operator: Operator): boolean {
    const token = this.#peek();
    if (token.type === "operator" && token.value === operator) {
      this.#tokenIndex += 1;

      return true;
    }

    return false;
  }

  #consumeWord(word: string): boolean {
    const token = this.#peek();
    if (token.type === "name" && token.value === word) {
      this.#tokenIndex += 1;

      return true;
    }

    return false;
  }

  #parseConditional(): Formula {
    const condition = this.#parseOr();
    const questionMarkToken = this.#peek();
    if (
      questionMarkToken.type !== "operator" ||
      questionMarkToken.value !== "?"
    ) {
      return condition;
    }
    this.#tokenIndex += 1;

    const consequent = this.#parseConditional();
    const colonToken = this.#peek();
    if (!this.#consumeOperator(":")) {
      if (canStartOperand(colonToken) || isSign(colonToken)) {
        this.#failUnexpectedToken(colonToken);
      }
      this.#fail(40, questionMarkToken);
    }
    const alternate = this.#parseConditional();

    return (x) => (condition(x) ? consequent(x) : alternate(x));
  }

  #parseOr(): Formula {
    let result = this.#parseAnd();
    while (this.#consumeWord("or")) {
      const left = result;
      const right = this.#parseAnd();
      result = (x) => (left(x) || right(x) ? 1 : 0);
    }

    return result;
  }

  #parseAnd(): Formula {
    let result = this.#parseComparison();
    while (this.#consumeWord("and")) {
      const left = result;
      const right = this.#parseComparison();
      result = (x) => (left(x) && right(x) ? 1 : 0);
    }

    return result;
  }

  #parseComparison(): Formula {
    return this.#parseBinary(comparisonOperations, () => this.#parseAdditive());
  }

  #parseAdditive(): Formula {
    return this.#parseBinary(additiveOperations, () =>
      this.#parseMultiplicative(),
    );
  }

  #parseMultiplicative(): Formula {
    return this.#parseBinary(multiplicativeOperations, () =>
      this.#parseFactor(),
    );
  }

  #parseBinary(
    operations: Map<Operator, BinaryOperation>,
    parseOperand: () => Formula,
  ): Formula {
    let result = parseOperand();
    for (;;) {
      const token = this.#peek();
      const operation =
        token.type === "operator" ? operations.get(token.value) : undefined;
      if (!operation) {
        return result;
      }
      this.#tokenIndex += 1;
      const left = result;
      const right = parseOperand();
      result = (x) => operation(left(x), right(x));
    }
  }

  #parseFactor(): Formula {
    const token = this.#peek();

    if (token.type === "operator" && ["-", "+"].includes(token.value)) {
      this.#tokenIndex += 1;
      const operand = this.#parseFactor();

      return token.value === "-" ? (x) => -operand(x) : operand;
    }

    const nextToken = this.#peek(1);
    const prefixFunction =
      token.type === "name" && nextToken.type !== "("
        ? formulaFunctions.get(token.value)
        : undefined;
    if (prefixFunction?.isPrefix) {
      if (!canStartOperand(nextToken)) {
        this.#fail(37, token);
      }
      this.#tokenIndex += 1;
      const operand = this.#parseFactor();
      const { evaluate } = prefixFunction;

      return (x) => evaluate(operand(x));
    }

    return this.#parseExponential();
  }

  #parseExponential(): Formula {
    let result = this.#parsePostfix();
    while (this.#consumeOperator("^")) {
      const base = result;
      const exponent = this.#parseFactor();
      result = (x) => base(x) ** exponent(x);
    }

    return result;
  }

  #parsePostfix(): Formula {
    let result = this.#parseAtom();
    while (this.#consumeOperator("!")) {
      const operand = result;
      result = (x) => factorial(operand(x));
    }

    return result;
  }

  #parseAtom(): Formula {
    const token = this.#peek();

    switch (token.type) {
      case "number": {
        this.#tokenIndex += 1;
        const { value } = token;

        return () => value;
      }

      case "(": {
        this.#tokenIndex += 1;
        const result = this.#parseConditional();
        this.#consumeClosingBracket();

        return result;
      }

      case "name": {
        if (!wordOperators.has(token.value)) {
          this.#tokenIndex += 1;

          return this.#parseName(token);
        }
        break;
      }
    }

    return this.#failMissingOperand(token);
  }

  #parseName(token: Token & { type: "name" }): Formula {
    const name = token.value;
    const isCall = this.#peek().type === "(";

    if (name === "y" || name === "Y") {
      this.#fail("y_in_f", token);
    } else if (name === "x") {
      if (isCall) {
        this.#fail(35, token);
      }

      return (x) => x;
    }

    const constant = formulaConstants.get(name);
    if (constant !== undefined) {
      if (isCall) {
        this.#fail(36, token);
      }

      return () => constant;
    }

    const formulaFunction = formulaFunctions.get(name);
    if (!formulaFunction) {
      const suggestedName = suggestFunctionName(name);
      throw new FormulaSyntaxError(
        isCall ? 34 : 31,
        getRange(token),
        name,
        [],
        suggestedName ? ["func_name_hint", name, suggestedName] : undefined,
      );
    }

    if (!isCall) {
      this.#fail(37, token);
    }
    this.#tokenIndex += 1;
    const args = this.#parseArguments(name);

    const { minArgumentCount: min, maxArgumentCount: max } = formulaFunction;
    const callRange: ErrorRange = [token.start, this.#peek(-1).end];
    if (args.length > max) {
      throw min === max
        ? new FormulaSyntaxError(52, callRange, name, [min])
        : new FormulaSyntaxError(51, callRange, name, [min, max]);
    }
    if (args.length < min) {
      throw min === max
        ? new FormulaSyntaxError(56, callRange, name, [min])
        : max === Infinity
          ? new FormulaSyntaxError(54, callRange, name, [min - 1])
          : new FormulaSyntaxError(55, callRange, name, [min, max]);
    }

    const { evaluate } = formulaFunction;

    return (x) => evaluate(...args.map((arg) => arg(x)));
  }

  /**
  Parses arguments after the opening bracket, including the closing one
  */
  #parseArguments(functionName: string): Formula[] {
    const args: Formula[] = [];
    if (this.#peek().type === ")") {
      this.#tokenIndex += 1;

      return args;
    }

    for (;;) {
      const token = this.#peek();
      const previousToken = this.#peek(-1);
      if (token.type === "," || (token.type === ")" && args.length > 0)) {
        if (previousToken.type === "(") {
          this.#fail(57, token, functionName);
        }
        this.#fail(58, previousToken, functionName);
      }

      args.push(this.#parseConditional());

      const nextToken = this.#peek();
      if (nextToken.type === ")") {
        this.#tokenIndex += 1;

        return args;
      }
      if (nextToken.type !== ",") {
        this.#failUnexpectedToken(nextToken);
      }
      this.#tokenIndex += 1;
    }
  }

  compile(): Formula {
    this.#checkBrackets();
    const formula = this.#parseConditional();
    const token = this.#peek();
    if (token.type !== "end") {
      this.#failUnexpectedToken(token);
    }

    return formula;
  }
}

export function compileFormula(rawFormula: string): Formula {
  return new FormulaCompiler(rawFormula).compile();
}
