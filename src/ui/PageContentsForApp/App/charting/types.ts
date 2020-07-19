import { ErrorConfig, ErrorRange } from "../shared/errors";

export type Formula = (x: number) => number;

export interface RawChartConfig {
  id: string;

  color: string;
  formula: string;
  numberOfPoints: string;
}

export interface InvalidChartConfig {
  type: "invalid";
  formulaErrorRange?: ErrorRange;
  numberOfPointsErrorRange?: ErrorRange;
  errors: ErrorConfig[];
}

export interface ValidChartConfig {
  type: "valid";
  formula: Formula;
  numberOfPoints: number;
  color: string;
}

export interface EmptyChartConfig {
  type: "empty";
}

export type ChartConfig =
  | InvalidChartConfig
  | ValidChartConfig
  | EmptyChartConfig;

export interface ChartCollection {
  activeItemId?: string;
  items: RawChartConfig[];
}

export type ChartCollectionAction =
  | { type: "updateItem"; rawChartConfig: RawChartConfig }
  | { type: "deleteItem"; itemId: string }
  | { type: "setActiveItem"; itemId?: string };

export type ChartCollectionContextValue = {
  rawChartConfigs: RawChartConfig[];
  activeRawChartConfig: RawChartConfig;
  modifyChartCollection: React.Dispatch<ChartCollectionAction>;
};

export type FormulaParseResult = Formula | ErrorConfig[];
