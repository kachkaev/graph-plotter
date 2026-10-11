import dynamic from "next/dynamic";
import { styled } from "styled-components";

import type { BottomPanelProps } from "./graph-plotter/bottom-panel";
import { ChartCollectionProvider } from "./graph-plotter/charting";
import { LeftPanel } from "./graph-plotter/left-panel";
import { Plot } from "./graph-plotter/plot";
import { PlotAreaProvider } from "./graph-plotter/plot-area";

const BottomPanel = dynamic<BottomPanelProps>(
  async () => {
    const mod = await import("./graph-plotter/bottom-panel");

    return mod.BottomPanel;
  },
  { ssr: false },
);

const bottomPanelMinHeight = 80;
const leftPanelMinWidth = 250;

const Wrapper = styled.div``;

const TopHalf = styled.div`
  display: flex;
  flex-direction: row;
`;

export function App({ width, height }: { width: number; height: number }) {
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
}
