import { curveLinear } from "@visx/curve";
import type { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import * as React from "react";

import {
  type Formula,
  getProcessedChartConfig,
  type RawChartConfig,
} from "../charting";

function isDrawable(
  value1: number,
  value2: number,
  min: number,
  max: number,
): boolean {
  return !(
    !Number.isFinite(value1) ||
    !Number.isFinite(value2) ||
    (value1 < min && value2 < min) ||
    (value1 > max && value2 > max) ||
    (value1 < min && value2 > max) ||
    (value1 > max && value2 < min)
  );
}

type LinearScale = ReturnType<typeof scaleLinear<number>>;
type DataPoint = [number, number];
type Section = DataPoint[];

function ChartShape({
  numberOfPoints,
  formula,
  isActive,
  xScale,
  yScale,
  color,
}: {
  numberOfPoints: number;
  formula: Formula;
  isActive?: boolean | undefined;
  color: string;
  xScale: LinearScale;
  yScale: LinearScale;
}) {
  const [xMin = 0, xMax = 0] = xScale.domain();
  const [yMin = 0, yMax = 0] = yScale.domain();
  const sections: Section[] = React.useMemo(() => {
    const result: Section[] = [];
    let prevDataPoint: DataPoint | undefined;
    let currentSection: Section = [];
    for (let index = 0; index <= numberOfPoints + 1; index += 1) {
      const x = xMin + ((xMax - xMin) * index) / numberOfPoints;
      const dataPoint: DataPoint = [x, formula(x)];

      if (
        index > numberOfPoints ||
        (prevDataPoint &&
          !isDrawable(dataPoint[1], prevDataPoint[1], yMin, yMax))
      ) {
        if (currentSection.length > 1) {
          result.push(currentSection);
        }
        currentSection = [];
      }

      currentSection.push(dataPoint);
      prevDataPoint = dataPoint;
    }

    return result;
  }, [xMax, xMin, yMax, yMin, numberOfPoints, formula]);

  return (
    <>
      {sections.map((dataPoints) => (
        <LinePath<DataPoint>
          // Sections never overlap, so the x of the first point is unique
          key={dataPoints[0]?.[0]}
          curve={curveLinear}
          data={dataPoints}
          x={(data) => xScale(data[0]) || 0}
          y={(data) => yScale(data[1]) || 0}
          stroke={color}
          strokeWidth={isActive ? 2 : 1}
          shapeRendering="geometricPrecision"
        />
      ))}
    </>
  );
}

const WrappedChartShape = React.memo(ChartShape);

function Chart({
  rawConfig,
  isActive,
  xScale,
  yScale,
}: {
  rawConfig: RawChartConfig;
  isActive?: boolean | undefined;
  xScale: LinearScale;
  yScale: LinearScale;
}) {
  const chartConfig = getProcessedChartConfig(rawConfig);

  if (chartConfig.type !== "valid") {
    return;
  }

  return (
    <WrappedChartShape
      isActive={isActive}
      xScale={xScale}
      yScale={yScale}
      color={chartConfig.color}
      formula={chartConfig.formula}
      numberOfPoints={chartConfig.numberOfPoints}
    />
  );
}

const WrappedChart = React.memo(Chart);
export { WrappedChart as Graph };
