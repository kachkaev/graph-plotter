import React from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";

import { PlotArea } from "./Plot";

const bottomPanelMinHeight = 40;
const leftPanelMinWidth = 200;

const Wrapper = styled.div`
  border: 1px solid red;
`;
const TopHalf = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPanel = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding-right: 10px;
`;

const LeftPanelHeader = styled.h2`
  border-bottom: 1px solid #ccc;
  font-size: 1em;
  color: #40628a;
  margin: 0;
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 22px;
  font-weight: bold;
  letter-spacing: -0.05em;
  font-family: "Arial Narrow", "Liberation Sans Narrow";
  padding-bottom: 20px;
`;

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
    <Wrapper style={{ width, height }}>
      <TopHalf>
        <LeftPanel>
          <AppName>
            {t("ui.l_app_title_1")}
            <br />
            {t("ui.l_app_title_2")}
          </AppName>
          <LeftPanelHeader>{t("ui.h_boundaries")}</LeftPanelHeader>
          <div>{t("ui.l_info")}</div>
          <LeftPanelHeader>{t("ui.h_info")}</LeftPanelHeader>
          <div>{t("ui.l_info")}</div>
        </LeftPanel>
        <PlotArea style={{ width: canvasSize, height: canvasSize }}></PlotArea>
      </TopHalf>
      <BottomPanel>
        <Trans i18nKey="error.wrong_bound" values={["x", "y"]}>
          <b />
        </Trans>
      </BottomPanel>
    </Wrapper>
  );
};
