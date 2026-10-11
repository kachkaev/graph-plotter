import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "styled-components";

import { useChartCollection } from "../charting";
import { PlotAreaForm } from "../plot-area-form";
import { ChartListItem } from "./chart-list-item";

const Header = styled.h2`
  border-bottom: 1px solid #ccc;
  font-size: 1em;
  color: #40628a;
  margin: 0;
  padding-top: 20px;
  margin-bottom: 3px;
  position: relative;
`;

const AddChartButton = styled.button.attrs({ children: "+" })`
  background: var(--background-color);
  position: absolute;
  bottom: 3px;
  right: -5px;
  border: none;
  font-weight: bold;
  color: #40628a;

  :active {
    transform: translate(0px, 1px);
  }

  :focus {
    outline: none;
  }
`;

const ChartList = styled.div`
  flex: 1;
  min-height: 0;
  margin-left: -5px;
  margin-right: -15px;
  padding-right: 10px;
  overflow: scroll;
`;

export function LeftPanelClientSideBlocks() {
  const { t } = useTranslation();
  const { rawChartConfigs, modifyChartCollection } = useChartCollection();

  const handleAddChartButtonClick = React.useCallback(() => {
    modifyChartCollection({ type: "addNewItem" });
  }, [modifyChartCollection]);

  const handleEmptySpaceClick = React.useCallback(() => {
    modifyChartCollection({ type: "setActiveItem" });
  }, [modifyChartCollection]);

  const newChartButton = (
    <AddChartButton
      onClick={handleAddChartButtonClick}
      title={t("ui.b_add_graph")}
    />
  );

  return (
    <>
      <Header>{t("ui.h_boundaries")}</Header>
      <PlotAreaForm />
      {rawChartConfigs.length > 0 ? (
        <>
          <Header>
            {t("ui.h_graphs")}
            {newChartButton}
          </Header>
          <ChartList onClick={handleEmptySpaceClick}>
            {rawChartConfigs.map((rawChartConfig) => (
              <ChartListItem
                key={rawChartConfig.id}
                rawChartConfig={rawChartConfig}
              />
            ))}
          </ChartList>
        </>
      ) : (
        <>
          <Header>
            {t("ui.h_info")}
            {newChartButton}
          </Header>
          <div>
            {t("ui.l_info_1")} {t("ui.l_info_2")}
          </div>
        </>
      )}
    </>
  );
}
