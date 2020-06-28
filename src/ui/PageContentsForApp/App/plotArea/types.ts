import { Draft } from "immer";

export interface RawPlotAreaConfig {
  showGrid: boolean;
  showAxes: boolean;
  xMin: string;
  xMax: string;
  yMin: string;
  yMax: string;
}

export interface PlotAreaConfigError {
  i18nKey: string;
  i18nValues: Array<string | number>;
}

export type ErrorRange = [number, number];

export interface InvalidPlotAreaConfig {
  type: "invalid";
  errorRangeByField: {
    xMin?: ErrorRange;
    xMax?: ErrorRange;
    yMin?: ErrorRange;
    yMax?: ErrorRange;
  };
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
) => void;

export type UpdateRawPlotAreaConfig = (
  updateFn: UpdateRawPlotAreaConfigFn,
) => void;

export interface PlotAreaContextValue {
  rawPlotAreaConfig: RawPlotAreaConfig;
  plotAreaConfig: PlotAreaConfig;
  updateRawPlotAreaConfig: UpdateRawPlotAreaConfig;
}
