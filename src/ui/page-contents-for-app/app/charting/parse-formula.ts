import { Parser } from "expr-eval";

import { FormulaParseResult } from "./types";

const constantLookup = {
  pi: Math.PI,
  e: Math.E,
};

export const parseFormula = (rawFormula: string): FormulaParseResult => {
  try {
    const parser = new Parser();
    const expression = parser.parse(rawFormula);

    // Testing for undefined symbols
    expression.evaluate({ x: 0, ...constantLookup });

    return (x) => expression.evaluate({ x, ...constantLookup }) as number;
  } catch {
    return [
      {
        i18nKey: "error.formula.30",
        i18nValues: ["", "", rawFormula],
      },
    ];
  }
};
