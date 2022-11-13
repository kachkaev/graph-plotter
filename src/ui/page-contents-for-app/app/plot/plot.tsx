import dynamic from "next/dynamic";
import * as React from "react";
import { useMeasure } from "react-use";
import styled from "styled-components";

import { usePlotArea } from "../plot-area";
import { Foreground } from "./foreground";
import { PlotContentsWithInvalidAreaProps } from "./plot-contents-with-invalid-area";
import { PlotContentsWithValidAreaProps } from "./plot-contents-with-valid-area";

export const plotBorderRadius = 7;

const PlotContentsWithInvalidArea = dynamic<PlotContentsWithInvalidAreaProps>(
  () =>
    import("./plot-contents-with-invalid-area").then(
      (mod) => mod.PlotContentsWithInvalidArea,
    ),
  { ssr: false },
);

const PlotContentsWithValidArea = dynamic<PlotContentsWithValidAreaProps>(
  () =>
    import("./plot-contents-with-valid-area").then(
      (mod) => mod.PlotContentsWithValidArea,
    ),
  { ssr: false },
);

const offset = 12;

const Wrapper = styled.div`
  position: relative;
  background: #e6e6e6;
  border: 1px solid #cacaca;
  border-radius: ${plotBorderRadius}px;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
`;

const Background = styled.div`
  position: absolute;
  background: #fff;
  top: ${offset}px;
  bottom: ${offset}px;
  left: ${offset}px;
  right: ${offset}px;
`;

const StyledForeground = styled(Foreground)`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const Plot: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { plotAreaConfig } = usePlotArea();
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <Wrapper ref={ref} {...props}>
      <Background />
      {plotAreaConfig.type === "valid" ? (
        <PlotContentsWithValidArea
          areaConfig={plotAreaConfig}
          width={width}
          height={height}
          offset={offset}
        />
      ) : (
        <PlotContentsWithInvalidArea areaConfig={plotAreaConfig} />
      )}

      <StyledForeground />
    </Wrapper>
  );
};
