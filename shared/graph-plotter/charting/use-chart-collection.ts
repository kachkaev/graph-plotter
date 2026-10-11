import * as React from "react";

import { ChartCollectionContext } from "./chart-collection-context";
import type { ChartCollectionContextValue } from "./types";

export function useChartCollection(): ChartCollectionContextValue {
  const result = React.use(ChartCollectionContext);
  if (!result) {
    throw new Error(
      "Cannot call useChartCollection() outside <ChartCollectionProvider />",
    );
  }

  return result;
}
