import { Draft } from "immer";

export type BoundaryName = "xMin" | "xMax" | "yMin" | "yMax";

export type RawPlotAreaConfig = {
  showGrid: boolean;
  showAxes: boolean;
} & Record<BoundaryName, string>;

export interface PlotAreaConfigError {
  i18nKey: string;
  i18nValues: Array<string | number>;
}

export type ErrorRange = [number, number];

export interface InvalidPlotAreaConfig {
  type: "invalid";
  errorRangeByBoundaryName: Partial<Record<BoundaryName, ErrorRange>>;
  errors: PlotAreaConfigError[];
}

export interface ValidPlotAreaConfig {
  type: "valid";
  showGrid: boolean;
  showAxes: boolean;
  xDomain: [number, number];
  yDomain: [number, number];
}

export type PlotAreaConfig = InvalidPlotAreaConfig | ValidPlotAreaConfig;

export type UpdateRawPlotAreaConfigFn = (
  draft: Draft<RawPlotAreaConfig>,
) => void | RawPlotAreaConfig;

export type UpdateRawPlotAreaConfig = (
  updateFn: UpdateRawPlotAreaConfigFn,
) => void;

export interface PlotAreaContextValue {
  rawPlotAreaConfig: RawPlotAreaConfig;
  plotAreaConfig: PlotAreaConfig;
  updateRawPlotAreaConfig: UpdateRawPlotAreaConfig;
}
