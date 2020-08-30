import { Parser } from "expr-eval";

import { FormulaParseResult } from "./types";

export const parseFormula = (rawFormula: string): FormulaParseResult => {
  try {
    const parser = new Parser();
    const expression = parser.parse(rawFormula);

    // Testing for undefined symbols
    expression.evaluate({ x: 0 });

    return (x) => expression.evaluate({ x });
  } catch (e) {
    return [
      {
        i18nKey: "error.formula.30",
        i18nValues: ["", "", rawFormula],
      },
    ];
  }
};
