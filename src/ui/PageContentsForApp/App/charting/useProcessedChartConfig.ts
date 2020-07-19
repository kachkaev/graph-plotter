import { parseNumericValue } from "../shared/parseNumericValue";
import {
  ChartConfig,
  Formula,
  InvalidChartConfig,
  RawChartConfig,
} from "./types";

const minNumberOfPoints = 50;
const maxNumberOfPoints = 10000;

const predefinedFormulaLookup: Record<string, Formula> = {
  x: (x) => x,
  "sin(x)": (x) => Math.sin(x),
  "tan(x)": (x) => Math.tan(x),
  "x^2": (x) => x * x,
  "1/x": (x) => 1 / x,
};

export const useProcessedChartConfig = (
  rawChartConfig: RawChartConfig,
): ChartConfig => {
  const result: InvalidChartConfig = {
    type: "invalid",
    errors: [],
  };

  // Parse number of points
  const rawNumberOfPoints = rawChartConfig.numberOfPoints;
  const numberOfPoints = parseNumericValue(rawNumberOfPoints);
  if (
    !isFinite(numberOfPoints) ||
    Math.round(numberOfPoints) !== numberOfPoints ||
    numberOfPoints > maxNumberOfPoints ||
    numberOfPoints < minNumberOfPoints
  ) {
    result.errors.push({
      i18nKey: "error.wrong_number_of_points",
      i18nValues: [minNumberOfPoints, maxNumberOfPoints],
    });
    result.numberOfPointsErrorRange = [0, rawNumberOfPoints.length];
  }

  // Parse formula
  const rawFormula = rawChartConfig.formula;
  const trimmedFormula = rawFormula.trim();
  if (!trimmedFormula.length && !result.errors.length) {
    return {
      type: "empty",
    };
  }

  // FIXME: implement parsing
  if (!result.errors.length && predefinedFormulaLookup[trimmedFormula]) {
    return {
      type: "valid",
      numberOfPoints,
      formula: predefinedFormulaLookup[trimmedFormula],
    };
  }

  result.formulaErrorRange = [0, rawFormula.length];
  result.errors.push({
    i18nKey: "error.formula.30",
    i18nValues: ["", "", rawFormula],
  });

  return result;
};
