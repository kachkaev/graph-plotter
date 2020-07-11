import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useChartCollection } from "./charting";
import { plotBorderRadius } from "./Plot";
import { Button } from "./shared/Button";
import { Input } from "./shared/Input";
import { NumericInput } from "./shared/NumericInput";

interface BottomPanelProps {
  plotAreaWidth: number;
}

const Wrapper = styled.div`
  padding: 10px 0 0 0;
  display: flex;
`;

const SectionBeforePlotArea = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  padding-right: 10px;
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
  margin-right: ${plotBorderRadius}px;
`;

FormulaInput.defaultProps = {
  prefix: "y = ",
};

export const BottomPanel: React.FunctionComponent<BottomPanelProps> = ({
  plotAreaWidth,
}) => {
  const { activeRawChartConfig } = useChartCollection();
  const { t } = useTranslation();
  return (
    <Wrapper>
      <SectionBeforePlotArea>
        <NumberOfPointsLabel>{t("ui.l_n_of_points")}</NumberOfPointsLabel>
        <NumberOfPointsInput value={activeRawChartConfig.numberOfPoints} />
      </SectionBeforePlotArea>
      <SectionUnderPlotArea style={{ width: plotAreaWidth }}>
        <FormulaInput value={activeRawChartConfig.formula} />
        <Button>{t("ui.b_plot")}</Button>
      </SectionUnderPlotArea>
    </Wrapper>
  );
};
