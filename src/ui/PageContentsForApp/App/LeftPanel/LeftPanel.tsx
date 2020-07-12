import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useChartCollection } from "../charting";
import { PlotAreaForm } from "../PlotAreaForm";
import { ChartListItem } from "./ChartListItem";

const Wrapper = styled.div`
  flex: 1;
  padding-right: 15px;
  min-width: 0;
  display: flex;
  max-height: 100%;
  align-items: stretch;
  flex-direction: column;
`;

const Header = styled.h2`
  border-bottom: 1px solid #ccc;
  font-size: 1em;
  color: #40628a;
  margin: 0;
  padding-top: 20px;
  margin-bottom: 3px;
  position: relative;
`;

const AddChartButton = styled.button`
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
AddChartButton.defaultProps = {
  children: "+",
};

const AppName = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 22px;
  font-weight: bold;
  letter-spacing: -0.05em;
  font-family: "Arial Narrow", "Liberation Sans Narrow";
  text-transform: uppercase;
`;

const Wip = styled.div``;

const ChartList = styled.div`
  flex: 1;
  min-height: 0;
  margin-left: -5px;
  margin-right: -15px;
  padding-right: 10px;
  overflow: scroll;
`;

export const LeftPanel: React.FunctionComponent<{ children?: never }> = () => {
  const { t } = useTranslation();
  const { rawChartConfigs, modifyChartCollection } = useChartCollection();

  const handleAddChartButtonClick = React.useCallback(() => {
    modifyChartCollection({ type: "setActiveItem", itemId: undefined });
  }, [modifyChartCollection]);

  return (
    <Wrapper>
      <AppName>
        {t("ui.l_app_title_1")}
        <br />
        {t("ui.l_app_title_2")}
      </AppName>
      <Header>{t("ui.h_boundaries")}</Header>
      <PlotAreaForm />
      {rawChartConfigs.length ? (
        <>
          <Header>
            {t("ui.h_charts")}
            <AddChartButton
              onClick={handleAddChartButtonClick}
              title={t("ui.b_add_graph")}
            />
          </Header>
          <ChartList>
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
          <Header>{t("ui.h_info")}</Header>
          <div>
            {t("ui.l_info_1")} {t("ui.l_info_2")}
          </div>
          <Wip>
            <Header>Work in progress 🚨</Header>
            <a href="https://vk.com/graph_plotter">
              original flash app (discontinued)
            </a>
            <br />
            <a href="https://vk.com/graph_plotter_club">app community</a>
            <br />
            <a href="https://github.com/graph-plotter/graph-plotter">
              github repo
            </a>
          </Wip>
        </>
      )}
    </Wrapper>
  );
};
