import dynamic from "next/dynamic";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { LeftPanelClientSideBlocksProps } from "./left-panel/left-panel-client-side-blocks";

const LeftPanelClientSideBlocks = dynamic<LeftPanelClientSideBlocksProps>(
  () =>
    import("./left-panel/left-panel-client-side-blocks").then(
      (mod) => mod.LeftPanelClientSideBlocks,
    ),
  { ssr: false },
);

const Wrapper = styled.div`
  flex: 1;
  padding-right: 15px;
  min-width: 0;
  display: flex;
  max-height: 100%;
  align-items: stretch;
  flex-direction: column;
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 22px;
  font-weight: bold;
  letter-spacing: -0.05em;
  font-family: "Arial Narrow", "Liberation Sans Narrow", "PT Sans Narrow";
  text-transform: uppercase;
`;

export const LeftPanel: React.FunctionComponent<{ children?: never }> = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <AppName>
        {t("ui.l_app_title_1")}
        <br />
        {t("ui.l_app_title_2")}
      </AppName>
      <LeftPanelClientSideBlocks />
    </Wrapper>
  );
};
