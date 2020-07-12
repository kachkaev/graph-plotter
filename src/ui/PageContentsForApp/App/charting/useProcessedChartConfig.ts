import { ChartConfig, InvalidChartConfig, RawChartConfig } from "./types";

const minNumberOfDots = 50;
const maxNumberOfDots = 10000;

export const useProcessedChartConfig = (
  rawChartConfig: RawChartConfig,
): ChartConfig => {
  const result: InvalidChartConfig = {
    type: "invalid",
    errors: [],
  };

  // Parse number of points
  const rawNumberOfPoints = rawChartConfig.numberOfPoints;
  const numberOfPoints = parseFloat(rawNumberOfPoints);
  if (
    !isFinite(numberOfPoints) ||
    numberOfPoints !== parseInt(rawNumberOfPoints) ||
    numberOfPoints > maxNumberOfDots ||
    numberOfPoints < minNumberOfDots
  ) {
    result.errors.push({
      i18nKey: "error.wrong_number_of_points",
      i18nValues: [minNumberOfDots, maxNumberOfDots],
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
  if (trimmedFormula === "x") {
    return {
      type: "valid",
      numberOfPoints,
      formula: (x) => x,
    };
  }
  result.formulaErrorRange = [0, rawFormula.length];
  result.errors.push({
    i18nKey: "error.formula.30",
    i18nValues: ["", "", rawFormula],
  });

  return result;
};
