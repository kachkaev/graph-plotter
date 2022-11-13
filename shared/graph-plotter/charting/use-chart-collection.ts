import * as React from "react";

import { ChartCollectionContext } from "./chart-collection-context";

export const useChartCollection = () => {
  const result = React.useContext(ChartCollectionContext);
  if (!result) {
    throw new Error(
      "Cannot call useChartCollection() outside <ChartCollectionProvider />",
    );
  }

  return result;
};
