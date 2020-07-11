import React from "react";

import { ChartCollectionContext } from "./ChartCollectionContext";
import { chartCollectionReducer } from "./chartCollectionReducer";
import { ChartCollectionContextValue } from "./types";

export const ChartCollectionProvider: React.FunctionComponent = ({
  children,
}) => {
  const [
    chartCollection,
    modifyChartCollection,
  ] = React.useReducer(chartCollectionReducer, { items: [] });

  const contextValue = React.useMemo<ChartCollectionContextValue>(() => {
    const activeChartItem = chartCollection.items.find(
      (chartItem) => chartItem.id === chartCollection.activeItemId,
    );
    return {
      chartItems: chartCollection.items,
      activeChartItem,
      modifyChartCollection,
    };
  }, [chartCollection, modifyChartCollection]);

  return (
    <ChartCollectionContext.Provider value={contextValue}>
      {children}
    </ChartCollectionContext.Provider>
  );
};
