import { availableColors } from "../shared/available-colors";
import { RawChartConfig } from "./types";

export const generateRawChartConfig = (
  existingItems?: RawChartConfig[],
): RawChartConfig => {
  const colorUsageCount: Record<string, number> = {};
  if (existingItems) {
    for (const item of existingItems) {
      colorUsageCount[item.color] = (colorUsageCount[item.color] ?? 0) + 1;
    }
  }

  const color =
    availableColors.find(
      (availableColor) => !colorUsageCount[availableColor],
    ) ??
    Object.entries(colorUsageCount).sort((a, b) =>
      a[1] > b[1] ? 1 : -1,
    )[0]?.[0] ??
    availableColors[0];

  return {
    id: crypto.randomUUID(),

    color,
    formula: "",
    numberOfPoints: "2000",
  };
};
