import { getProcessedChartConfig } from "./getProcessedChartConfig";
import { ChartConfig, RawChartConfig } from "./types";

export const useProcessedChartConfig = (
  rawChartConfig: RawChartConfig,
): ChartConfig => {
  return getProcessedChartConfig(rawChartConfig);
};
