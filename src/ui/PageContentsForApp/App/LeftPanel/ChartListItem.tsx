import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import {
  RawChartConfig,
  useChartCollection,
  useProcessedChartConfig,
} from "../charting";

const Wrapper = styled.div<{ isActive?: boolean }>`
  border-radius: 4px;
  padding: 0 5px 2px;
  display: flex;
  align-items: center;
  margin: 0;
  ${(p) => (p.isActive ? "background-color: #dedede; " : "cursor: default;")};
`;

const ColorIndicator = styled.span<{ isInvalid?: boolean }>`
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 10px;
  margin-right: 5px;
  ${(p) => (p.isInvalid ? "opacity: 0;" : "")};
`;

const FormulaContainer = styled.span`
  display: block;
  flex: 1;
  min-width: 0;
`;
const Formula = styled.span<{ isInvalid?: boolean }>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${(p) => (p.isInvalid ? "text-decoration: line-through;" : "")};
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
  const isInvalid = processedChartConfig.type !== "valid";

  const handleClick = React.useCallback(() => {
    modifyChartCollection({
      type: "setActiveItem",
      itemId: rawChartConfig.id,
    });
  }, [rawChartConfig.id, modifyChartCollection]);

  const handleDeleteClick = React.useCallback<React.MouseEventHandler>(
    (e) => {
      modifyChartCollection({
        type: "deleteItem",
        itemId: rawChartConfig.id,
      });
      e.stopPropagation();
    },
    [rawChartConfig.id, modifyChartCollection],
  );

  return (
    <Wrapper isActive={isActive} onClick={isActive ? undefined : handleClick}>
      <ColorIndicator
        isInvalid={isInvalid}
        style={{ background: rawChartConfig.color }}
      />
      <FormulaContainer>
        <Formula isInvalid={isInvalid}>
          {t("ui.l_y_equals")}
          {rawChartConfig.formula}
        </Formula>
      </FormulaContainer>
      {isActive ? (
        <DeleteButton onClick={handleDeleteClick}></DeleteButton>
      ) : null}
    </Wrapper>
  );
};
