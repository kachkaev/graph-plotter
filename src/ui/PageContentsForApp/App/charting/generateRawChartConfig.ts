import { v4 as uuidv4 } from "uuid";

import { availableColors } from "../shared/availableColors";
import { RawChartConfig } from "./types";

export const generateRawChartConfig = (
  existingItems?: RawChartConfig[],
): RawChartConfig => {
  const colorUsageCount: Record<string, number> = {};
  existingItems?.forEach((item) => {
    colorUsageCount[item.color] = (colorUsageCount[item.color] ?? 0) + 1;
  });

  const color =
    availableColors.find(
      (availableColor) => !colorUsageCount[availableColor],
    ) ??
    Object.entries(colorUsageCount).sort((a, b) =>
      a[1] > b[1] ? 1 : -1,
    )[0]?.[0] ??
    availableColors[0];

  return {
    id: uuidv4(),

    color,
    formula: "",
    numberOfPoints: "2000",
  };
};
