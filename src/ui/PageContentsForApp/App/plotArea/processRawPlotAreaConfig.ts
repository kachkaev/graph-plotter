import { ErrorConfig, ErrorRange } from "../shared/errors";
import { BoundaryName, PlotAreaConfig, RawPlotAreaConfig } from "./types";

type ReportError = (error: ErrorConfig) => void;
type ReportFailedBoundary = (
  boundaryName: BoundaryName,
  errorRange: ErrorRange,
) => void;

const maxValue = 1000;
const minDelta = 0.5;

const parseBoundary = (
  rawPlotAreaConfig: RawPlotAreaConfig,
  boundaryName: BoundaryName,
  reportError: ReportError,
  reportFailedFiled: ReportFailedBoundary,
): number => {
  const rawValue = rawPlotAreaConfig[boundaryName];
  const value = parseFloat(rawValue);
  if (!isFinite(value) || Math.abs(maxValue) > maxValue) {
    reportError({
      i18nKey: "error.wrong_bound",
      //TODO: Replace .toLowerCase() with proper i18n label
      i18nValues: [boundaryName.toLowerCase(), maxValue],
    });
    reportFailedFiled(boundaryName, [0, rawValue.length]);
    return Number.NaN;
  }
  return value;
};

export const processRawPlotAreaConfig = (
  rawPlotAreaConfig: RawPlotAreaConfig,
): PlotAreaConfig => {
  const errors: ErrorConfig[] = [];

  const reportError: ReportError = (error) => {
    errors.push(error);
  };
  const errorRangeByBoundaryName: Partial<Record<
    BoundaryName,
    ErrorRange
  >> = {};

  const reportFailedFiled: ReportFailedBoundary = (
    boundaryName,
    errorRange,
  ) => {
    if (!errorRangeByBoundaryName[boundaryName]) {
      errorRangeByBoundaryName[boundaryName] = errorRange;
    }
  };

  const xMin = parseBoundary(
    rawPlotAreaConfig,
    "xMin",
    reportError,
    reportFailedFiled,
  );
  const xMax = parseBoundary(
    rawPlotAreaConfig,
    "xMax",
    reportError,
    reportFailedFiled,
  );
  const yMin = parseBoundary(
    rawPlotAreaConfig,
    "yMin",
    reportError,
    reportFailedFiled,
  );
  const yMax = parseBoundary(
    rawPlotAreaConfig,
    "yMax",
    reportError,
    reportFailedFiled,
  );

  if (xMax - xMin < minDelta) {
    reportError({
      i18nKey: "error.small_range",
      //TODO: Replace "xmin" and "xmax" with proper i18n labels
      i18nValues: ["xmin", "xmax", minDelta],
    });
  }

  if (yMax - yMin < minDelta) {
    reportError({
      i18nKey: "error.small_range",
      //TODO: Replace "ymin" and "ymax" with proper i18n labels
      i18nValues: ["ymin", "ymax", minDelta],
    });
  }

  if (errors.length) {
    return {
      type: "invalid",
      errorRangeByBoundaryName,
      errors,
    };
  }

  return {
    type: "valid",
    showAxes: rawPlotAreaConfig.showAxes,
    showGrid: rawPlotAreaConfig.showGrid,
    xDomain: [xMin, xMax],
    yDomain: [yMin, yMax],
  };
};
