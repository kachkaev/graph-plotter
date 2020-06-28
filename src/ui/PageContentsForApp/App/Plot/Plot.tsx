import { AxisBottom, AxisLeft, AxisRight, AxisTop } from "@vx/axis";
import { Grid } from "@vx/grid";
import { scaleLinear } from "@vx/scale";
import React from "react";
import { useMeasure } from "react-use";
import styled from "styled-components";

import { Foreground } from "./Foreground";

const offset = 12;

const Wrapper = styled.div`
  position: relative;
  background: #e6e6e6;
  border: 1px solid #cacaca;
  border-radius: 7px;
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

const Svg = styled.svg`
  position: absolute;
  font-size: 8px;
`;

const StyledForeground = styled(Foreground)`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const PlotArea: React.FunctionComponent<React.HTMLAttributes<
  HTMLDivElement
>> = (props) => {
  const [xMin, xMax, yMin, yMax] = [-10, 10, -10, 10];

  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const canvasWidth = width - offset * 2;
  const canvasHeight = height - offset * 2;

  const numTicksColumns = 20;
  const numTicksRows = 20;

  const xScale = scaleLinear({
    domain: [xMin, xMax],
    range: [0, canvasWidth],
  });
  const clampedXScale = scaleLinear({
    domain: [xMin, xMax],
    range: [0, canvasWidth],
    clamp: true,
  });
  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [canvasHeight, 0],
  });
  const clampedYScale = scaleLinear({
    domain: [yMin, yMax],
    range: [canvasHeight, 0],
    clamp: true,
  });

  const axisXTop = offset + clampedYScale(0);
  const AxisX = canvasHeight - offset - axisXTop > 20 ? AxisBottom : AxisTop;

  const axisYLeft = offset + clampedXScale(0);
  const AxisY = canvasWidth - offset - axisYLeft > 20 ? AxisRight : AxisLeft;

  return (
    <Wrapper ref={ref} {...props}>
      <Background />
      <Svg width={width} height={height}>
        <Grid
          top={offset}
          left={offset}
          xScale={xScale}
          yScale={yScale}
          stroke="#e6e6e6"
          width={width - offset * 2}
          height={height - offset * 2}
          numTicksColumns={numTicksColumns}
          numTicksRows={numTicksRows}
        />
        <AxisX
          left={offset}
          top={axisXTop}
          scale={xScale}
          tickLength={3}
          stroke="#000"
          numTicks={numTicksColumns}
          hideZero={true}
          labelClassName="axisLabel"
        />
        <AxisY
          left={axisYLeft}
          top={offset}
          scale={yScale}
          tickLength={3}
          stroke="#000"
          numTicks={numTicksRows}
          hideZero={true}
        />
      </Svg>
      <StyledForeground />
    </Wrapper>
  );
};
