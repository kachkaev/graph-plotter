import type * as React from "react";

import type { ErrorConfig, ErrorRange } from "../shared/errors";

export type Formula = (x: number) => number;

export type RawChartConfig = {
  id: string;

  color: string;
  formula: string;
  numberOfPoints: string;
};

export type InvalidChartConfig = {
  type: "invalid";
  formulaErrorRange?: ErrorRange;
  numberOfPointsErrorRange?: ErrorRange;
  errors: ErrorConfig[];
};

export type ValidChartConfig = {
  type: "valid";
  formula: Formula;
  numberOfPoints: number;
  color: string;
};

export type EmptyChartConfig = {
  type: "empty";
};

export type ChartConfig =
  InvalidChartConfig | ValidChartConfig | EmptyChartConfig;

export type ChartCollection = {
  activeItemId?: string | undefined;
  items: RawChartConfig[];
};

export type ChartCollectionAction =
  | { type: "addNewItem" }
  | { type: "updateItem"; rawChartConfig: RawChartConfig }
  | { type: "deleteItem"; itemId: string }
  | { type: "setActiveItem"; itemId?: string | undefined };

export type ChartCollectionContextValue = {
  rawChartConfigs: RawChartConfig[];
  activeRawChartConfig: RawChartConfig;
  modifyChartCollection: React.Dispatch<ChartCollectionAction>;
};

export type FormulaParseResult = Formula | ErrorConfig[];
