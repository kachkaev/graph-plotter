import {
  ErrorRange,
  PlotAreaConfig,
  PlotAreaConfigError,
  RawPlotAreaConfig,
} from "./types";

type FieldName = "xMin" | "xMax" | "yMin" | "yMax";
type ReportError = (error: PlotAreaConfigError) => void;
type ReportFailedFiled = (fieldName: FieldName, errorRange: ErrorRange) => void;

const maxValue = 1000;
const minDelta = 0.5;

const parseField = (
  rawPlotAreaConfig: RawPlotAreaConfig,
  fieldName: FieldName,
  reportError: ReportError,
  reportFailedFiled: ReportFailedFiled,
): number => {
  const rawValue = rawPlotAreaConfig[fieldName];
  const value = parseFloat(rawValue);
  if (!isFinite(value) || Math.abs(maxValue) > maxValue) {
    reportError({
      i18nKey: "error.wrong_bound",
      //TODO: Replace .toLowerCase() with proper i18n label
      i18nValues: [fieldName.toLowerCase(), maxValue],
    });
    reportFailedFiled(fieldName, [0, rawValue.length]);
    return Number.NaN;
  }
  return value;
};

export const processRawPlotAreaConfig = (
  rawPlotAreaConfig: RawPlotAreaConfig,
): PlotAreaConfig => {
  const errors: PlotAreaConfigError[] = [];

  const reportError: ReportError = (error) => {
    errors.push(error);
  };
  const failedFieldLookup: Partial<Record<FieldName, ErrorRange>> = {};

  const reportFailedFiled: ReportFailedFiled = (fieldName, errorRange) => {
    if (!failedFieldLookup[fieldName]) {
      failedFieldLookup[fieldName] = errorRange;
    }
  };

  const xMin = parseField(
    rawPlotAreaConfig,
    "xMin",
    reportError,
    reportFailedFiled,
  );
  const xMax = parseField(
    rawPlotAreaConfig,
    "xMax",
    reportError,
    reportFailedFiled,
  );
  const yMin = parseField(
    rawPlotAreaConfig,
    "yMin",
    reportError,
    reportFailedFiled,
  );
  const yMax = parseField(
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
      errorRangeByField: {},
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
