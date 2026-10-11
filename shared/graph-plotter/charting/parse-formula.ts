import { compileFormula } from "./parse-formula/compile-formula";
import type { FormulaParseResult } from "./types";

export function parseFormula(rawFormula: string): FormulaParseResult {
  try {
    return compileFormula(rawFormula);
  } catch {
    return [
      {
        i18nKey: "error.formula.30",
        i18nValues: ["", "", rawFormula],
      },
    ];
  }
}
