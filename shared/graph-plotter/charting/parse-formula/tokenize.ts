import { FormulaSyntaxError } from "./formula-syntax-error";

export type Operator =
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "^"
  | "!"
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "?"
  | ":";

type Punctuation = "(" | ")" | ",";

type TokenPosition = {
  start: number;
  end: number;
};

export type Token = TokenPosition &
  (
    | { type: "number"; value: number }
    | { type: "name"; value: string }
    | { type: "operator"; value: Operator }
    | { type: Punctuation | "end" }
  );

const operatorLookup = new Map<string, Operator>([
  ["==", "=="],
  ["!=", "!="],
  ["<=", "<="],
  [">=", ">="],
  ["+", "+"],
  ["-", "-"],
  ["−", "-"],
  ["*", "*"],
  ["∙", "*"],
  ["•", "*"],
  ["·", "*"],
  ["×", "*"],
  ["/", "/"],
  ["%", "%"],
  ["^", "^"],
  ["!", "!"],
  ["<", "<"],
  [">", ">"],
  ["?", "?"],
  [":", ":"],
]);

const punctuationLookup = new Map<string, Punctuation>([
  ["(", "("],
  [")", ")"],
  [",", ","],
]);

const whitespacePattern = /\s+/y;
const numberPattern = /[\d.]+/y;
const exponentPattern = /e[+-]?\d+/iy;
const namePattern = /[a-z_]\w*/iy;

function matchAt(
  pattern: RegExp,
  text: string,
  position: number,
): string | undefined {
  pattern.lastIndex = position;

  return pattern.exec(text)?.[0];
}

function matchOperator(
  text: string,
  position: number,
): [operator: Operator, length: number] | undefined {
  for (const length of [2, 1]) {
    const operator = operatorLookup.get(
      text.slice(position, position + length),
    );
    if (operator) {
      return [operator, length];
    }
  }

  return undefined;
}

export function tokenize(rawFormula: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;

  while (position < rawFormula.length) {
    const start = position;

    const whitespace = matchAt(whitespacePattern, rawFormula, start);
    if (whitespace) {
      position += whitespace.length;
      continue;
    }

    const digitsAndDots = matchAt(numberPattern, rawFormula, start);
    if (digitsAndDots && /\d/.test(digitsAndDots)) {
      if (digitsAndDots.indexOf(".") !== digitsAndDots.lastIndexOf(".")) {
        throw new FormulaSyntaxError(start, start + digitsAndDots.length);
      }
      const exponent =
        matchAt(exponentPattern, rawFormula, start + digitsAndDots.length) ??
        "";
      const text = digitsAndDots + exponent;
      position += text.length;
      tokens.push({
        type: "number",
        value: Number(text),
        start,
        end: position,
      });
      continue;
    }

    const name = matchAt(namePattern, rawFormula, start);
    if (name) {
      position += name.length;
      tokens.push({ type: "name", value: name, start, end: position });
      continue;
    }

    const operatorMatch = matchOperator(rawFormula, start);
    if (operatorMatch) {
      const [operator, length] = operatorMatch;
      position += length;
      tokens.push({ type: "operator", value: operator, start, end: position });
      continue;
    }

    const punctuation = punctuationLookup.get(rawFormula.charAt(start));
    if (punctuation) {
      position += 1;
      tokens.push({ type: punctuation, start, end: position });
      continue;
    }

    const codePoint = rawFormula.codePointAt(start) ?? 0;
    throw new FormulaSyntaxError(
      start,
      start + String.fromCodePoint(codePoint).length,
    );
  }

  return tokens;
}
