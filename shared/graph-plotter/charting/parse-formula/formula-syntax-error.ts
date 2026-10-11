import type { ErrorConfig, ErrorRange } from "../../shared/errors";

/**
 * Numbers match error.formula.* translation keys, which come from the Flash
 * version of the app. Strings match other error.* keys.
 */
export type FormulaErrorCode =
  | 1 // empty formula
  | 2 // formula is too long
  | 3 // unknown symbol
  | 20 // extra right bracket
  | 21 // unclosed left bracket
  | 22 // left bracket right after right bracket
  | 23 // empty brackets
  | 30 // generic error
  | 31 // unknown variable or constant
  | 32 // wrong number format
  | 33 // comma outside function arguments
  | 34 // unknown function
  | 35 // variable used as a function
  | 36 // constant used as a function
  | 37 // function without brackets
  | 38 // missing operator between operands
  | 39 // number is too big
  | 40 // operator in a wrong place
  | 41 // operator at the end
  | 42 // operator at the beginning
  | 43 // operator before right bracket
  | 44 // operator after left bracket
  | 45 // operator before comma
  | 46 // operator after comma
  | 47 // operator after another operator
  | 51 // too many arguments (from N to M)
  | 52 // too many arguments (exactly N)
  | 54 // too few arguments (more than N)
  | 55 // too few arguments (from N to M)
  | 56 // too few arguments (exactly N)
  | 57 // missing argument between bracket and comma
  | 58 // missing argument after comma
  | "equal_presents"
  | "y_in_f";

export type FormulaErrorHint =
  | "comma"
  | "vertical_slash"
  | "x_rus"
  | [key: "func_name_hint", typedName: string, suggestedName: string];

export class FormulaSyntaxError extends Error {
  readonly errorConfig: ErrorConfig;
  readonly errorRange: ErrorRange;

  constructor(
    code: FormulaErrorCode,
    [start, end]: ErrorRange,
    subject: string | number = "",
    extraValues: Array<string | number> = [],
    hint?: FormulaErrorHint,
  ) {
    super(`Formula error ${code} at ${start}…${end}`);
    this.name = "FormulaSyntaxError";

    // Values match the Flash version: {0} position, {1} length, {2} subject,
    // {3} and {4} extra details
    this.errorConfig = {
      i18nKey:
        typeof code === "number" ? `error.formula.${code}` : `error.${code}`,
      i18nValues: [start, end - start, subject, ...extraValues],
      hint:
        typeof hint === "string"
          ? { i18nKey: `error.${hint}`, i18nValues: [] }
          : hint
            ? { i18nKey: `error.${hint[0]}`, i18nValues: hint.slice(1) }
            : undefined,
    };
    this.errorRange = [start, end];
  }
}
