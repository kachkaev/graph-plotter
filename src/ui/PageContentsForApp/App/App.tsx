import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";

import { BottomPanelProps } from "./BottomPanel";
import { ChartCollectionProvider } from "./charting";
import { LeftPanel } from "./LeftPanel";
import { Plot } from "./Plot";
import { PlotAreaProvider } from "./plotArea";

const BottomPanel = dynamic<BottomPanelProps>(
  () => import("./BottomPanel").then((mod) => mod.BottomPanel),
  { ssr: false },
);

const bottomPanelMinHeight = 80;
const leftPanelMinWidth = 250;

const Wrapper = styled.div``;

const TopHalf = styled.div`
  display: flex;
  flex-direction: row;
`;

export const App: React.FunctionComponent<{
  width: number;
  height: number;
}> = ({ width, height }) => {
  const canvasSize = Math.min(
    width - leftPanelMinWidth,
    height - bottomPanelMinHeight,
  );

  return (
    <PlotAreaProvider>
      <ChartCollectionProvider>
        <Wrapper style={{ width, height }}>
          <TopHalf style={{ height: canvasSize }}>
            <LeftPanel />
            <Plot style={{ width: canvasSize, height: canvasSize }} />
          </TopHalf>
          <BottomPanel plotAreaWidth={canvasSize} />
        </Wrapper>
      </ChartCollectionProvider>
    </PlotAreaProvider>
  );
};
