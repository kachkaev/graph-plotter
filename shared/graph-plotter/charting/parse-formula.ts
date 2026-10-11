import { Parser } from "expr-eval";

import type { FormulaParseResult } from "./types";

const constantLookup = {
  pi: Math.PI,
  e: Math.E,
};

export function parseFormula(rawFormula: string): FormulaParseResult {
  try {
    const parser = new Parser();
    const expression = parser.parse(rawFormula);

    // Testing for undefined symbols
    expression.evaluate({ x: 0, ...constantLookup });

    return (x) => Number(expression.evaluate({ x, ...constantLookup }));
  } catch {
    return [
      {
        i18nKey: "error.formula.30",
        i18nValues: ["", "", rawFormula],
      },
    ];
  }
}
