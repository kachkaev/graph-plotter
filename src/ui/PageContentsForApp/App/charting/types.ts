import { ErrorConfig, ErrorRange } from "../shared/errors";

export type Formula = (x: number) => number;

export interface RawChartConfig {
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
}

export interface EmptyChartConfig {
  type: "empty";
}

export type ChartConfig =
  | InvalidChartConfig
  | ValidChartConfig
  | EmptyChartConfig;

export interface ChartCollectionItem {
  id: string;
  rawConfig: RawChartConfig;
}

export interface ChartCollection {
  activeItemId?: string;
  items: ChartCollectionItem[];
}

export type ChartCollectionAction =
  | { type: "updateActiveItem"; rawChartConfig: RawChartConfig }
  | { type: "deleteItem"; itemId: string }
  | { type: "setActiveItem"; itemId?: string };

export type ChartCollectionContextValue = {
  chartItems: ChartCollectionItem[];
  activeChartItem?: ChartCollectionItem;
  modifyChartCollection: React.Dispatch<ChartCollectionAction>;
};
