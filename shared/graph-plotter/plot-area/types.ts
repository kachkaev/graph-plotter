import type { Draft } from "immer";

import type { ErrorConfig, ErrorRange } from "../shared/errors";

export type BoundaryName = "xMin" | "xMax" | "yMin" | "yMax";

export type RawPlotAreaConfig = {
  showGrid: boolean;
  showAxes: boolean;
} & Record<BoundaryName, string>;

export type InvalidPlotAreaConfig = {
  type: "invalid";
  errorRangeByBoundaryName: Partial<Record<BoundaryName, ErrorRange>>;
  errors: ErrorConfig[];
};

export type ValidPlotAreaConfig = {
  type: "valid";
  showGrid: boolean;
  showAxes: boolean;
  xDomain: [number, number];
  yDomain: [number, number];
};

export type PlotAreaConfig = InvalidPlotAreaConfig | ValidPlotAreaConfig;

export type UpdateRawPlotAreaConfigFn = (
  draft: Draft<RawPlotAreaConfig>,
) => undefined | RawPlotAreaConfig;

export type UpdateRawPlotAreaConfig = (
  updateFn: UpdateRawPlotAreaConfigFn,
) => void;

export type PlotAreaContextValue = {
  rawPlotAreaConfig: RawPlotAreaConfig;
  plotAreaConfig: PlotAreaConfig;
  updateRawPlotAreaConfig: UpdateRawPlotAreaConfig;
};
