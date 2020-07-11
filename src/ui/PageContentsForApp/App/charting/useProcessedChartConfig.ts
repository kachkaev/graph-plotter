import { ChartConfig, RawChartConfig } from "./types";

export const useProcessedChartConfig = (
  rawChartConfig: RawChartConfig,
): ChartConfig => {
  const trimmedFormula = rawChartConfig.formula.trim();
  if (!trimmedFormula.length) {
  }

  return {
    type: "invalid",
    errors: [],
  };
};
