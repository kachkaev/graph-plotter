import { curveLinear } from "@vx/curve";
import { LinePath } from "@vx/shape";
import { ScaleLinear } from "d3-scale";
import React from "react";

import { Formula, RawChartConfig, useProcessedChartConfig } from "../charting";

const deriveDrawability = (
  value1: number,
  value2: number,
  min: number,
  max: number,
) => {
  if (
    !isFinite(value1) ||
    !isFinite(value2) ||
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
    let prevDataPoint: DataPoint | undefined = undefined;
    let currentSection: Section = [];
    for (let i = 0; i <= numberOfPoints + 1; i += 1) {
      const x = xMin + ((xMax - xMin) * i) / numberOfPoints;
      const dataPoint: DataPoint = [x, formula(x)];

      if (
        i > numberOfPoints ||
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
          x={(d) => xScale(d[0])}
          y={(d) => yScale(d[1])}
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
    return null;
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
