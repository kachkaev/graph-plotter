import LRU from "lru-cache";

import { parseNumericValue } from "../shared/parseNumericValue";
import { parseFormula } from "./parseFormula";
import { ChartConfig, InvalidChartConfig, RawChartConfig } from "./types";

const chartConfigCache = new LRU<string, ChartConfig>(1000);

const minNumberOfPoints = 50;
const maxNumberOfPoints = 10000;

const generateProcessedChartConfig = (
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

  const formulaOrErrors = parseFormula(rawFormula);
  if (!result.errors.length && typeof formulaOrErrors === "function") {
    return {
      type: "valid",
      numberOfPoints,
      formula: formulaOrErrors,
      color: rawChartConfig.color,
    };
  }
  if (typeof formulaOrErrors !== "function") {
    result.errors.push(...formulaOrErrors);
    result.formulaErrorRange = [0, rawFormula.length];
  }

  return result;
};

export const getProcessedChartConfig = (
  rawChartConfig: RawChartConfig,
): ChartConfig => {
  const cacheKey = JSON.stringify(rawChartConfig);
  const entry = chartConfigCache.get(cacheKey);
  if (entry) {
    return entry;
  }

  const newEntry = generateProcessedChartConfig(rawChartConfig);
  chartConfigCache.set(cacheKey, newEntry);
  return newEntry;
};
