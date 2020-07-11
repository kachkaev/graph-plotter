import React from "react";
import styled from "styled-components";

import { BottomPanel } from "./BottomPanel";
import { ChartCollectionProvider } from "./charting";
import { LeftPanel } from "./LeftPanel";
import { Plot } from "./Plot";
import { PlotAreaProvider } from "./plotArea";

const bottomPanelMinHeight = 40;
const leftPanelMinWidth = 250;

const Wrapper = styled.div`
  /* outline: 1px solid red; */
`;
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
          <TopHalf>
            <LeftPanel />
            <Plot style={{ width: canvasSize, height: canvasSize }}></Plot>
          </TopHalf>
          <BottomPanel plotAreaWidth={canvasSize} />
        </Wrapper>
      </ChartCollectionProvider>
    </PlotAreaProvider>
  );
};
