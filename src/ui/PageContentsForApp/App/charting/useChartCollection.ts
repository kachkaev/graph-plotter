import React from "react";

import { ChartCollectionContext } from "./ChartCollectionContext";

export const useChartCollection = () => {
  const result = React.useContext(ChartCollectionContext);
  if (!result) {
    throw new Error(
      "Cannot call useChartCollection() outside <ChartCollectionProvider />",
    );
  }

  return result;
};
