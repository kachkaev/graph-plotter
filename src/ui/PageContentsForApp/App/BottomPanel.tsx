import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";

import { Nobr } from "../../shared/essentials";
import {
  RawChartConfig,
  useChartCollection,
  useProcessedChartConfig,
} from "./charting";
import { plotBorderRadius } from "./Plot";
import { Button } from "./shared/Button";
import { Input } from "./shared/Input";
import { NumericInput } from "./shared/NumericInput";

const Wrapper = styled.div``;

const MainRow = styled.div`
  padding: 10px 0 0 0;
  display: flex;
`;

const ErrorRow = styled.div`
  margin-left: auto;
  padding-top: 5px;
`;

const ErrorMesage = styled.div`
  margin-left: -70px;
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

type WipStateField = "formula" | "numberOfPoints";
type WipState = Pick<RawChartConfig, WipStateField>;
type WipStateAction =
  | { type: "reset"; value: WipState }
  | { type: "update"; fieldName: WipStateField; value: string };
type WipStateReducer = React.Reducer<WipState, WipStateAction>;
const wipStateReducer: WipStateReducer = (wipState, action) => {
  switch (action.type) {
    case "reset": {
      return action.value;
    }

    case "update": {
      return { ...wipState, [action.fieldName]: action.value };
    }
  }
};

export interface BottomPanelProps {
  plotAreaWidth: number;
}

export const BottomPanel: React.FunctionComponent<BottomPanelProps> = ({
  plotAreaWidth,
}) => {
  const { activeRawChartConfig, modifyChartCollection } = useChartCollection();
  const processedChartConfig = useProcessedChartConfig(activeRawChartConfig);

  const { t } = useTranslation();
  const [wipState, dispatchWipState] = React.useReducer(wipStateReducer, {
    formula: activeRawChartConfig.formula,
    numberOfPoints: activeRawChartConfig.numberOfPoints,
  });

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
  }, [activeRawChartConfig, modifyChartCollection, wipState]);

  const numberOfPointsHasError =
    processedChartConfig.type === "invalid" &&
    processedChartConfig.numberOfPointsErrorRange;

  const formulaHasError =
    processedChartConfig.type === "invalid" &&
    processedChartConfig.formulaErrorRange;

  const numberOfPointsStatus =
    wipState.numberOfPoints !== activeRawChartConfig.numberOfPoints
      ? "modified"
      : numberOfPointsHasError
      ? "error"
      : undefined;

  const formulaStatus =
    wipState.formula !== activeRawChartConfig.formula
      ? "modified"
      : formulaHasError
      ? "error"
      : undefined;

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
            prefix={t("ui.l_y_equals")!}
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
          <ErrorMesage>
            <Trans
              i18nKey={errorConfigToShow.i18nKey}
              values={errorConfigToShow.i18nValues}
            >
              <b />
              <Nobr />
            </Trans>
          </ErrorMesage>
        </ErrorRow>
      ) : undefined}
    </Wrapper>
  );
};
