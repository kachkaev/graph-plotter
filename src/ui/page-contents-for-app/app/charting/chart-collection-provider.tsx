import * as React from "react";
import { useLocalStorage } from "react-use";

import { ChartCollectionContext } from "./chart-collection-context";
import { chartCollectionReducer } from "./chart-collection-reducer";
import { generateRawChartConfig } from "./generate-raw-chart-config";
import { ChartCollectionContextValue, RawChartConfig } from "./types";

export const ChartCollectionProvider: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [savedRawChartConfigs, saveRawChartConfigs] =
    useLocalStorage<RawChartConfig[]>("gp.chartConfigs");

  const [chartCollection, modifyChartCollection] = React.useReducer(
    chartCollectionReducer,
    {
      items: savedRawChartConfigs ?? [],
    },
  );

  React.useEffect(() => {
    saveRawChartConfigs(chartCollection.items);
  }, [chartCollection.items, saveRawChartConfigs]);

  const existingActiveRawChartConfig = chartCollection.items.find(
    (chartItem) => chartItem.id === chartCollection.activeItemId,
  );

  const activeRawChartConfig = React.useMemo(
    () =>
      existingActiveRawChartConfig ??
      generateRawChartConfig(chartCollection.items),
    [existingActiveRawChartConfig, chartCollection.items],
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
