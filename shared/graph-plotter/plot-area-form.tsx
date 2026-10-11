import { produce } from "immer";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "styled-components";

import {
  type BoundaryName,
  defaultRawPlotAreaConfig,
  usePlotArea,
} from "./plot-area";
import { Button } from "./shared/button";
import { Checkbox } from "./shared/checkbox";
import { NumericInput } from "./shared/numeric-input";

const Wrapper = styled.div``;

const CheckboxRow = styled.div`
  padding: 5px 0 8px;

  justify-items: auto;

  & > span {
    display: inline-block;
  }

  & > :first-child {
    margin-right: 20px;
  }
`;

const ButtonRow = styled.div`
  padding: 2px 0 5px;

  text-align: right;
  justify-items: auto;

  & > button {
    margin: 10px 0 0 10px;
  }

  & > :first-child {
    margin-left: 0;
  }
`;

type WipState = Record<BoundaryName, string>;
type WipStateUpdateAction = {
  type: "update";
  boundaryName: BoundaryName;
  value: string;
};
type WipStateResetAction = { type: "reset"; value: WipState };
type WipStateAction = WipStateUpdateAction | WipStateResetAction;

const BoundaryControlRow = styled.div`
  & + & {
    padding-top: 10px;
  }
`;

const BoundaryControlWrapper = styled.div`
  display: inline-block;
  width: 50%;
  text-align: right;
`;

const BoundaryControlLabel = styled.label`
  font-weight: bold;
  direction: inline-block;
  color: #666;
  padding-right: 5px;
`;

const BoundaryControlInput = styled(NumericInput)`
  display: inline-flex;
`;

function BoundaryControl({
  boundaryName,
  wipState,
  dispatchWipState,
  onSubmit,
}: {
  boundaryName: BoundaryName;
  wipState: WipState;
  dispatchWipState: React.Dispatch<WipStateAction>;
  onSubmit: () => void;
}) {
  const { rawPlotAreaConfig, plotAreaConfig } = usePlotArea();
  const { t } = useTranslation();
  const handleChange = React.useCallback(
    (newValue: string) => {
      dispatchWipState({
        type: "update",
        boundaryName,
        value: newValue,
      });
    },
    [boundaryName, dispatchWipState],
  );

  const initialValue = rawPlotAreaConfig[boundaryName];
  const value = wipState[boundaryName];
  const hasError =
    plotAreaConfig.type === "invalid" &&
    plotAreaConfig.errorRangeByBoundaryName[boundaryName] !== undefined;

  return (
    <BoundaryControlWrapper>
      <BoundaryControlLabel>
        {t(`ui.l_${boundaryName.toLowerCase()}`)}
      </BoundaryControlLabel>
      <BoundaryControlInput
        name={boundaryName}
        onChange={handleChange}
        onSubmit={onSubmit}
        status={
          value === initialValue ? (hasError ? "error" : undefined) : "modified"
        }
        value={value}
      />
    </BoundaryControlWrapper>
  );
}

function wipStateReducer(state: WipState, action: WipStateAction): WipState {
  return produce(state, (draft) => {
    switch (action.type) {
      case "update": {
        draft[action.boundaryName] = action.value;

        return;
      }
      case "reset": {
        return action.value;
      }
    }
  });
}

export function PlotAreaForm() {
  const { t } = useTranslation();
  const { rawPlotAreaConfig, updateRawPlotAreaConfig } = usePlotArea();

  const [wipState, dispatchWipState] = React.useReducer(wipStateReducer, {
    xMin: rawPlotAreaConfig.xMin,
    xMax: rawPlotAreaConfig.xMax,
    yMin: rawPlotAreaConfig.yMin,
    yMax: rawPlotAreaConfig.yMax,
  });

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

  function handleDefaultsClick() {
    dispatchWipState({
      type: "reset",
      value: {
        xMin: defaultRawPlotAreaConfig.xMin,
        xMax: defaultRawPlotAreaConfig.xMax,
        yMin: defaultRawPlotAreaConfig.yMin,
        yMax: defaultRawPlotAreaConfig.yMax,
      },
    });
    updateRawPlotAreaConfig(() => defaultRawPlotAreaConfig);
  }

  const handleApplyClick = React.useCallback(() => {
    updateRawPlotAreaConfig((draft) => ({
      ...draft,
      ...wipState,
    }));
  }, [updateRawPlotAreaConfig, wipState]);

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
      <BoundaryControlRow>
        <BoundaryControl
          boundaryName="xMin"
          wipState={wipState}
          dispatchWipState={dispatchWipState}
          onSubmit={handleApplyClick}
        />
        <BoundaryControl
          boundaryName="xMax"
          wipState={wipState}
          dispatchWipState={dispatchWipState}
          onSubmit={handleApplyClick}
        />
      </BoundaryControlRow>
      <BoundaryControlRow>
        <BoundaryControl
          boundaryName="yMin"
          wipState={wipState}
          dispatchWipState={dispatchWipState}
          onSubmit={handleApplyClick}
        />
        <BoundaryControl
          boundaryName="yMax"
          wipState={wipState}
          dispatchWipState={dispatchWipState}
          onSubmit={handleApplyClick}
        />
      </BoundaryControlRow>
      <ButtonRow>
        <Button onClick={handleDefaultsClick} $secondary={true}>
          {t("ui.b_defaults")}
        </Button>
        <Button onClick={handleApplyClick}>{t("ui.b_apply")}</Button>
      </ButtonRow>
    </Wrapper>
  );
}
