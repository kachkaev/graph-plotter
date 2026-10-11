import type { Formula } from "../types";
import { FormulaSyntaxError } from "./formula-syntax-error";
import { factorial, formulaConstants, formulaFunctions } from "./functions";
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
 */
class FormulaCompiler {
  readonly #tokens: Token[];
  readonly #endToken: Token;
  #tokenIndex = 0;

  constructor(rawFormula: string) {
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

  #fail(token: Token): never {
    throw new FormulaSyntaxError(token.start, token.end);
  }

  #consume(type: Token["type"]) {
    const token = this.#peek();
    if (token.type !== type) {
      this.#fail(token);
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
    if (!this.#consumeOperator("?")) {
      return condition;
    }

    const consequent = this.#parseConditional();
    if (!this.#consumeOperator(":")) {
      this.#fail(this.#peek());
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

    const prefixFunction =
      token.type === "name" && this.#peek(1).type !== "("
        ? formulaFunctions.get(token.value)
        : undefined;
    if (prefixFunction?.isPrefix) {
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
    this.#tokenIndex += 1;

    switch (token.type) {
      case "number": {
        const { value } = token;

        return () => value;
      }

      case "(": {
        const result = this.#parseConditional();
        this.#consume(")");

        return result;
      }

      case "name": {
        return this.#parseName(token);
      }

      default: {
        return this.#fail(token);
      }
    }
  }

  #parseName(token: Token & { type: "name" }): Formula {
    if (token.value === "x") {
      return (x) => x;
    }

    const constant = formulaConstants.get(token.value);
    if (constant !== undefined) {
      return () => constant;
    }

    const formulaFunction = formulaFunctions.get(token.value);
    if (!formulaFunction) {
      return this.#fail(token);
    }

    this.#consume("(");
    const args = this.#parseArguments();
    if (
      args.length < formulaFunction.minArgumentCount ||
      args.length > formulaFunction.maxArgumentCount
    ) {
      this.#fail(token);
    }
    const { evaluate } = formulaFunction;

    return (x) => evaluate(...args.map((arg) => arg(x)));
  }

  #parseArguments(): Formula[] {
    const args: Formula[] = [];
    if (this.#peek().type === ")") {
      this.#tokenIndex += 1;

      return args;
    }

    for (;;) {
      args.push(this.#parseConditional());
      const token = this.#peek();
      this.#tokenIndex += 1;
      if (token.type === ")") {
        return args;
      }
      if (token.type !== ",") {
        this.#fail(token);
      }
    }
  }

  compile(): Formula {
    const formula = this.#parseConditional();
    this.#consume("end");

    return formula;
  }
}

export function compileFormula(rawFormula: string): Formula {
  return new FormulaCompiler(rawFormula).compile();
}
