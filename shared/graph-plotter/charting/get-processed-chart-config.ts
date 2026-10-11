import { LRUCache } from "lru-cache";

import { parseNumericValue } from "../shared/parse-numeric-value";
import { getParsedFormula } from "./get-parsed-formula";
import type { ChartConfig, InvalidChartConfig, RawChartConfig } from "./types";

const chartConfigCache = new LRUCache<string, ChartConfig>({ max: 1000 });

const minNumberOfPoints = 50;
const maxNumberOfPoints = 10_000;

function generateProcessedChartConfig(
  rawChartConfig: RawChartConfig,
): ChartConfig {
  const result: InvalidChartConfig = {
    type: "invalid",
    errors: [],
  };

  // Parse number of points
  const rawNumberOfPoints = rawChartConfig.numberOfPoints;
  const numberOfPoints = parseNumericValue(rawNumberOfPoints);
  if (
    !Number.isFinite(numberOfPoints) ||
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
  if (trimmedFormula.length === 0 && result.errors.length === 0) {
    return {
      type: "empty",
    };
  }

  const formulaOrErrors = getParsedFormula(rawFormula);
  if (typeof formulaOrErrors === "function" && result.errors.length === 0) {
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
}

export function getProcessedChartConfig(
  rawChartConfig: RawChartConfig,
): ChartConfig {
  const cacheKey = JSON.stringify(rawChartConfig);
  const entry = chartConfigCache.get(cacheKey);
  if (entry) {
    return entry;
  }

  const newEntry = generateProcessedChartConfig(rawChartConfig);
  chartConfigCache.set(cacheKey, newEntry);

  return newEntry;
}
