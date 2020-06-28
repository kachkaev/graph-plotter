import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Plot } from "./Plot";
import { PlotAreaProvider } from "./plotArea";
import { PlotAreaForm } from "./PlotAreaForm";

const bottomPanelMinHeight = 40;
const leftPanelMinWidth = 200;

const Wrapper = styled.div`
  /* outline: 1px solid red; */
`;
const TopHalf = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPanel = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding-right: 15px;
`;

const LeftPanelHeader = styled.h2`
  border-bottom: 1px solid #ccc;
  font-size: 1em;
  color: #40628a;
  margin: 0;
  padding-top: 20px;
  margin-bottom: 3px;
`;

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
const BottomPanel = styled.div``;

export const App: React.FunctionComponent<{
  width: number;
  height: number;
}> = ({ width, height }) => {
  const canvasSize = Math.min(
    width - leftPanelMinWidth,
    height - bottomPanelMinHeight,
  );

  const { t } = useTranslation();

  return (
    <PlotAreaProvider>
      <Wrapper style={{ width, height }}>
        <TopHalf>
          <LeftPanel>
            <AppName>
              {t("ui.l_app_title_1")}
              <br />
              {t("ui.l_app_title_2")}
            </AppName>
            <LeftPanelHeader>{t("ui.h_boundaries")}</LeftPanelHeader>
            <PlotAreaForm />
            <LeftPanelHeader>{t("ui.h_info")}</LeftPanelHeader>
            <div>
              {t("ui.l_info_1")} {t("ui.l_info_2")}
            </div>
            <Wip>
              <LeftPanelHeader>Work in progress 🚨</LeftPanelHeader>
              <a href="https://vk.com/graph_plotter">
                original flash app (discontinued)
              </a>
              <br />
              <a href="https://github.com/graph-plotter/graph-plotter">
                github repo
              </a>
            </Wip>
          </LeftPanel>
          <Plot style={{ width: canvasSize, height: canvasSize }}></Plot>
        </TopHalf>
        <BottomPanel></BottomPanel>
      </Wrapper>
    </PlotAreaProvider>
  );
};
