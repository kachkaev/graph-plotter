import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import {
  RawChartConfig,
  useChartCollection,
  useProcessedChartConfig,
} from "../charting";
import { transparentColor } from "../shared/availableColors";
import { ColorPicker } from "./ColorPicker/ColorPicker";

const Wrapper = styled.div<{ isActive?: boolean }>`
  border-radius: 4px;
  padding: 0 5px 2px;
  display: flex;
  align-items: center;
  margin: 0;
  ${(props) =>
    props.isActive ? "background-color: #dedede; " : "cursor: default;"};
`;

const Indicator = styled.span`
  display: block;
  width: 10px;
`;
const FormulaContainer = styled.span`
  display: block;
  flex: 1;
  min-width: 0;
`;
const Formula = styled.span<{ isHidden?: boolean; isInvalid?: boolean }>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => (props.isHidden && !props.isInvalid ? "opacity: 0.5" : "")};
  ${(props) => (props.isInvalid ? "text-decoration: line-through;" : "")};
`;

const DeleteButton = styled.button`
  font-weight: bold;
  border: none;
  background: none;
  padding: 3px;
  margin-right: -2px;

  :active {
    transform: translate(0px, 1px);
  }

  :focus {
    outline: none;
  }

  :hover {
    color: #c00;
  }
`;

DeleteButton.defaultProps = {
  children: "×",
};

export const ChartListItem: React.FunctionComponent<{
  rawChartConfig: RawChartConfig;
}> = ({ rawChartConfig }) => {
  const { activeRawChartConfig, modifyChartCollection } = useChartCollection();
  const processedChartConfig = useProcessedChartConfig(rawChartConfig);
  const { t } = useTranslation();

  const isActive = activeRawChartConfig === rawChartConfig;
  const isInvalid = processedChartConfig.type === "invalid";

  const handleClick = React.useCallback<React.MouseEventHandler>(
    (event) => {
      modifyChartCollection({
        type: "setActiveItem",
        itemId: rawChartConfig.id,
      });
      event.stopPropagation();
    },
    [rawChartConfig.id, modifyChartCollection],
  );

  const handleColorPickerChange = React.useCallback(
    (newValue: string) => {
      modifyChartCollection({
        type: "updateItem",
        rawChartConfig: { ...rawChartConfig, color: newValue },
      });
    },
    [rawChartConfig, modifyChartCollection],
  );

  const handleDeleteClick = React.useCallback<React.MouseEventHandler>(
    (event) => {
      modifyChartCollection({
        type: "deleteItem",
        itemId: rawChartConfig.id,
      });
      event.stopPropagation();
    },
    [rawChartConfig.id, modifyChartCollection],
  );

  return (
    <Wrapper isActive={isActive} onClick={handleClick}>
      <Indicator>
        {isInvalid ? null : (
          <ColorPicker
            disabled={!isActive}
            value={rawChartConfig.color}
            onChange={handleColorPickerChange}
          />
        )}
      </Indicator>
      <FormulaContainer>
        <Formula
          isInvalid={isInvalid}
          isHidden={rawChartConfig.color === transparentColor}
        >
          {t("ui.l_y_equals")}
          {rawChartConfig.formula}
        </Formula>
      </FormulaContainer>
      {isActive ? <DeleteButton onClick={handleDeleteClick} /> : null}
    </Wrapper>
  );
};
