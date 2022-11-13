import { getProcessedChartConfig } from "./get-processed-chart-config";
import { ChartConfig, RawChartConfig } from "./types";

export const useProcessedChartConfig = (
  rawChartConfig: RawChartConfig,
): ChartConfig => {
  return getProcessedChartConfig(rawChartConfig);
};
