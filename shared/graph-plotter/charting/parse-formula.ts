import { compileFormula } from "./parse-formula/compile-formula";
import { FormulaSyntaxError } from "./parse-formula/formula-syntax-error";
import type { FormulaParseResult } from "./types";

export function parseFormula(rawFormula: string): FormulaParseResult {
  try {
    return compileFormula(rawFormula);
  } catch (error) {
    if (error instanceof FormulaSyntaxError) {
      return { error: error.errorConfig, errorRange: error.errorRange };
    }

    // Deeply nested brackets exceed the call stack
    const i18nKey =
      error instanceof RangeError ? "error.formula.2" : "error.formula.0";

    return {
      error: { i18nKey, i18nValues: [0, rawFormula.length, rawFormula] },
      errorRange: [0, rawFormula.length],
    };
  }
}
