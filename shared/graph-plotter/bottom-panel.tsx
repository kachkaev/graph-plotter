import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "styled-components";

import { Nobr } from "../essentials";
import {
  getProcessedChartConfig,
  type RawChartConfig,
  useChartCollection,
} from "./charting";
import { plotBorderRadius } from "./plot";
import { Button } from "./shared/button";
import { Input } from "./shared/input";
import { NumericInput } from "./shared/numeric-input";

const Wrapper = styled.div``;

const MainRow = styled.div`
  padding: 10px 0 0 0;
  display: flex;
`;

const ErrorRow = styled.div`
  margin-left: auto;
  padding-top: 5px;
`;

const ErrorMessage = styled.div`
  margin-left: -70px;
`;

const ErrorHint = styled.span`
  color: #666;
`;

const SectionBeforePlotArea = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  padding-right: 15px;
  display: flex;
  justify-content: flex-end;
`;

const NumberOfPointsLabel = styled.label`
  font-weight: bold;
  display: inline-flex;
  color: #666;
  padding-top: 2px;
  padding-right: 5px;
`;

const NumberOfPointsInput = styled(NumericInput)`
  display: inline-flex;
`;

const SectionUnderPlotArea = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 0 ${plotBorderRadius}px;
  box-sizing: border-box;
`;

const FormulaInput = styled(Input)`
  flex-grow: 1;
  margin-right: 10px;
`;

// <Trans /> parses translations as HTML, so symbols like < in values need
// escaping to show up in error messages (shouldUnescape restores them)
function escapeI18nValues(
  values: Array<string | number>,
): Array<string | number> {
  return values.map((value) =>
    typeof value === "string"
      ? value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
      : value,
  );
}

type WipStateField = "formula" | "numberOfPoints";
type WipState = Pick<RawChartConfig, WipStateField>;
type WipStateAction =
  | { type: "reset"; value: WipState }
  | { type: "update"; fieldName: WipStateField; value: string };

function wipStateReducer(wipState: WipState, action: WipStateAction): WipState {
  switch (action.type) {
    case "reset": {
      return action.value;
    }

    case "update": {
      return { ...wipState, [action.fieldName]: action.value };
    }
  }
}

export type BottomPanelProps = {
  plotAreaWidth: number;
};

export function BottomPanel({ plotAreaWidth }: BottomPanelProps) {
  const { activeRawChartConfig, modifyChartCollection } = useChartCollection();
  const processedChartConfig = getProcessedChartConfig(activeRawChartConfig);

  const { t } = useTranslation();
  const [wipState, dispatchWipState] = React.useReducer(wipStateReducer, {
    formula: activeRawChartConfig.formula,
    numberOfPoints: activeRawChartConfig.numberOfPoints,
  });
  const formulaInputRef = React.useRef<HTMLInputElement>(null);

  React.useLayoutEffect(() => {
    dispatchWipState({ type: "reset", value: activeRawChartConfig });
  }, [activeRawChartConfig, dispatchWipState]);

  const handleNumberOfPointsChange = React.useCallback((newValue: string) => {
    dispatchWipState({
      type: "update",
      fieldName: "numberOfPoints",
      value: newValue,
    });
  }, []);

  const handleFormulaChange = React.useCallback((newValue: string) => {
    dispatchWipState({
      type: "update",
      fieldName: "formula",
      value: newValue,
    });
  }, []);

  const handleSubmit = React.useCallback(() => {
    const rawChartConfig = {
      ...activeRawChartConfig,
      ...wipState,
    };
    modifyChartCollection({
      type: "updateItem",
      rawChartConfig,
    });

    // Point at the problem in the formula, like the Flash version did
    const newProcessedChartConfig = getProcessedChartConfig(rawChartConfig);
    if (
      newProcessedChartConfig.type === "invalid" &&
      newProcessedChartConfig.formulaErrorRange
    ) {
      formulaInputRef.current?.focus();
      formulaInputRef.current?.setSelectionRange(
        ...newProcessedChartConfig.formulaErrorRange,
      );
    }
  }, [activeRawChartConfig, modifyChartCollection, wipState]);

  const numberOfPointsHasError =
    processedChartConfig.type === "invalid" &&
    processedChartConfig.numberOfPointsErrorRange;

  const formulaHasError =
    processedChartConfig.type === "invalid" &&
    processedChartConfig.formulaErrorRange;

  const numberOfPointsStatus =
    wipState.numberOfPoints === activeRawChartConfig.numberOfPoints
      ? numberOfPointsHasError
        ? "error"
        : undefined
      : "modified";

  const formulaStatus =
    wipState.formula === activeRawChartConfig.formula
      ? formulaHasError
        ? "error"
        : undefined
      : "modified";

  const errorConfigToShow =
    processedChartConfig.type === "invalid" && processedChartConfig.errors[0];

  return (
    <Wrapper>
      <MainRow>
        <SectionBeforePlotArea>
          <NumberOfPointsLabel>{t("ui.l_n_of_points")}</NumberOfPointsLabel>
          <NumberOfPointsInput
            value={wipState.numberOfPoints}
            status={numberOfPointsStatus}
            onChange={handleNumberOfPointsChange}
            onSubmit={handleSubmit}
          />
        </SectionBeforePlotArea>
        <SectionUnderPlotArea style={{ width: plotAreaWidth }}>
          <FormulaInput
            inputRef={formulaInputRef}
            prefix={t("ui.l_y_equals")}
            value={wipState.formula}
            status={formulaStatus}
            onChange={handleFormulaChange}
            onSubmit={handleSubmit}
          />
          <Button onClick={handleSubmit}>{t("ui.b_plot")}</Button>
        </SectionUnderPlotArea>
      </MainRow>
      {errorConfigToShow ? (
        <ErrorRow style={{ width: plotAreaWidth }}>
          <ErrorMessage>
            <Trans
              i18nKey={errorConfigToShow.i18nKey}
              values={escapeI18nValues(errorConfigToShow.i18nValues)}
              shouldUnescape={true}
            >
              <b />
              <Nobr />
            </Trans>
            {errorConfigToShow.hint ? (
              <ErrorHint>
                <Trans
                  i18nKey={errorConfigToShow.hint.i18nKey}
                  values={escapeI18nValues(errorConfigToShow.hint.i18nValues)}
                  shouldUnescape={true}
                >
                  <b />
                </Trans>
              </ErrorHint>
            ) : undefined}
          </ErrorMessage>
        </ErrorRow>
      ) : undefined}
    </Wrapper>
  );
}
