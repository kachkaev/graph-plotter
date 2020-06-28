import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { defaultRawPlotAreaConfig, usePlotArea } from "./plotArea";
import { Checkbox } from "./shared/Checkbox";

const Wrapper = styled.div`
  padding-bottom: 20px;
`;

const CheckboxRow = styled.div`
  padding: 5px 0;

  display: flex;
  justify-items: auto;

  & > :first-child {
    padding-right: 20px;
  }
`;
const ButtonRow = styled.div`
  padding: 5px 0;

  display: flex;
  justify-items: auto;

  & > :first-child {
    padding-right: 20px;
  }
`;

export const PlotAreaForm: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { rawPlotAreaConfig, updateRawPlotAreaConfig } = usePlotArea();

  const handleCheckboxChange = React.useCallback<
    React.FormEventHandler<HTMLInputElement>
  >(
    (event) => {
      const { id, checked } = event.currentTarget;
      updateRawPlotAreaConfig((draft) => {
        if (id !== "showGrid" && id !== "showAxes") {
          return;
        }
        draft[id] = checked;
      });
    },
    [updateRawPlotAreaConfig],
  );

  const handleDefaultsClick = () => {
    updateRawPlotAreaConfig(() => {
      return defaultRawPlotAreaConfig;
    });
  };

  const handleApplyClick = () => {
    updateRawPlotAreaConfig((draft) => {
      draft.xMin = `${Math.round(Math.random() * 50) - 20}`;
    });
  };

  return (
    <Wrapper>
      <CheckboxRow>
        <Checkbox
          checked={rawPlotAreaConfig.showGrid}
          id="showGrid"
          onChange={handleCheckboxChange}
        >
          {t("ui.c_show_grid")}
        </Checkbox>
        <Checkbox
          checked={rawPlotAreaConfig.showAxes}
          id="showAxes"
          onChange={handleCheckboxChange}
        >
          {t("ui.c_show_axes")}
        </Checkbox>
      </CheckboxRow>
      {/* <BoundaryControlRow>
        <BoundaryControl name="xMin" />
        <BoundaryControl name="xMax" />
        <BoundaryControl name="yMin" />
        <BoundaryControl name="yMax" />
      </BoundaryControlRow> */}
      <ButtonRow>
        <button onClick={handleDefaultsClick}>{t("ui.b_defaults")}</button>
        <button onClick={handleApplyClick}>{t("ui.b_apply")}</button>
      </ButtonRow>
    </Wrapper>
  );
};
