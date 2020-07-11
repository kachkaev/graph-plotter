import React from "react";

import { ChartCollectionContext } from "./ChartCollectionContext";
import { chartCollectionReducer } from "./chartCollectionReducer";
import { generateRawChartConfig } from "./generateRawChartConfig";
import { ChartCollectionContextValue } from "./types";

export const ChartCollectionProvider: React.FunctionComponent = ({
  children,
}) => {
  const [
    chartCollection,
    modifyChartCollection,
  ] = React.useReducer(chartCollectionReducer, { items: [] });

  const existingActiveRawChartConfig = chartCollection.items.find(
    (chartItem) => chartItem.id === chartCollection.activeItemId,
  );

  const activeRawChartConfig = React.useMemo(
    () => existingActiveRawChartConfig ?? generateRawChartConfig(),
    [existingActiveRawChartConfig],
  );

  const contextValue = React.useMemo<ChartCollectionContextValue>(() => {
    return {
      rawChartConfigs: chartCollection.items,
      activeRawChartConfig,
      modifyChartCollection,
    };
  }, [activeRawChartConfig, chartCollection.items]);

  return (
    <ChartCollectionContext.Provider value={contextValue}>
      {children}
    </ChartCollectionContext.Provider>
  );
};
