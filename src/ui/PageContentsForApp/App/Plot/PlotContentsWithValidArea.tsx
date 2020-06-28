import { AxisBottom, AxisLeft, AxisRight, AxisTop } from "@vx/axis";
import { Grid } from "@vx/grid";
import { scaleLinear } from "@vx/scale";
import React from "react";
import styled from "styled-components";

import { ValidPlotAreaConfig } from "../plotArea";

const Svg = styled.svg`
  position: absolute;
`;

export const PlotContentsWithValidArea: React.FunctionComponent<{
  areaConfig: ValidPlotAreaConfig;
  width: number;
  height: number;
  offset: number;
}> = ({ areaConfig, width, height, offset }) => {
  const { xDomain, yDomain, showGrid, showAxes } = areaConfig;
  const canvasWidth = width - offset * 2;
  const canvasHeight = height - offset * 2;

  const numTicksColumns = 20;
  const numTicksRows = 20;

  const xScale = scaleLinear({
    domain: xDomain,
    range: [0, canvasWidth],
  });
  const clampedXScale = scaleLinear({
    domain: xDomain,
    range: [0, canvasWidth],
    clamp: true,
  });
  const yScale = scaleLinear({
    domain: yDomain,
    range: [canvasHeight, 0],
  });
  const clampedYScale = scaleLinear({
    domain: yDomain,
    range: [canvasHeight, 0],
    clamp: true,
  });

  const axisXTop = offset + clampedYScale(0);
  const AxisX = canvasHeight - offset - axisXTop > 20 ? AxisBottom : AxisTop;

  const axisYLeft = offset + clampedXScale(0);
  const AxisY = canvasWidth - offset - axisYLeft > 20 ? AxisRight : AxisLeft;

  return (
    <Svg width={width} height={height}>
      {showGrid ? (
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
      ) : null}
      {showAxes ? (
        <>
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
        </>
      ) : null}
    </Svg>
  );
};
