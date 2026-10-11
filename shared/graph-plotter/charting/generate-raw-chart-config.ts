import { availableColors } from "../shared/available-colors";
import type { RawChartConfig } from "./types";

export function generateRawChartConfig(
  existingItems?: RawChartConfig[],
): RawChartConfig {
  const colorUsageCount: Record<string, number> = {};
  if (existingItems) {
    for (const item of existingItems) {
      colorUsageCount[item.color] = (colorUsageCount[item.color] ?? 0) + 1;
    }
  }

  const color =
    availableColors.find(
      (availableColor) => (colorUsageCount[availableColor] ?? 0) === 0,
    ) ??
    Object.entries(colorUsageCount).toSorted((a, b) => a[1] - b[1])[0]?.[0] ??
    availableColors[0];

  return {
    id: crypto.randomUUID(),

    color,
    formula: "",
    numberOfPoints: "2000",
  };
}
