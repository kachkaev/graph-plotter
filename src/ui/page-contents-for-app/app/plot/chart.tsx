import { curveLinear } from "@visx/curve";
import { LinePath } from "@visx/shape";
import { ScaleLinear } from "d3-scale";
import * as React from "react";

import { Formula, RawChartConfig, useProcessedChartConfig } from "../charting";

const deriveDrawability = (
  value1: number,
  value2: number,
  min: number,
  max: number,
) => {
  if (
    !Number.isFinite(value1) ||
    !Number.isFinite(value2) ||
    (value1 < min && value2 < min) ||
    (value1 > max && value2 > max) ||
    (value1 < min && value2 > max) ||
    (value1 > max && value2 < min)
  ) {
    return false;
  }

  return true;
};

type DataPoint = [number, number];
type Section = DataPoint[];

const ChartShape: React.FunctionComponent<{
  numberOfPoints: number;
  formula: Formula;
  isActive?: boolean;
  color: string;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}> = ({ numberOfPoints, formula, isActive, xScale, yScale, color }) => {
  const [xMin, xMax] = xScale.domain();
  const [yMin, yMax] = yScale.domain();
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
          !deriveDrawability(dataPoint[1], prevDataPoint[1], yMin, yMax))
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
      {sections.map((dataPoints, sectionIndex) => (
        <LinePath<DataPoint>
          key={sectionIndex}
          curve={curveLinear}
          data={dataPoints}
          x={(data) => xScale(data[0]) ?? 0}
          y={(data) => yScale(data[1]) ?? 0}
          stroke={color}
          strokeWidth={isActive ? 2 : 1}
          shapeRendering="geometricPrecision"
        />
      ))}
    </>
  );
};

const WrappedChartShape = React.memo(ChartShape);

const Chart: React.FunctionComponent<{
  rawConfig: RawChartConfig;
  isActive?: boolean;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}> = ({ rawConfig, isActive, xScale, yScale }) => {
  const chartConfig = useProcessedChartConfig(rawConfig);

  if (chartConfig.type !== "valid") {
    return <></>;
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
};

const WrappedChart = React.memo(Chart);
export { WrappedChart as Graph };
