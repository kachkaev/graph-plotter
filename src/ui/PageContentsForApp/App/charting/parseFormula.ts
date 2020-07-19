import { Formula, FormulaParseResult } from "./types";

const predefinedFormulaLookup: Record<string, Formula> = {
  x: (x) => x,
  "sin(x)": (x) => Math.sin(x),
  "tan(x)": (x) => Math.tan(x),
  "x^2": (x) => x * x,
  "1/x": (x) => 1 / x,
};

export const parseFormula = (rawFormula: string): FormulaParseResult => {
  if (predefinedFormulaLookup[rawFormula]) {
    return predefinedFormulaLookup[rawFormula];
  }

  return [
    {
      i18nKey: "error.formula.30",
      i18nValues: ["", "", rawFormula],
    },
  ];
};
