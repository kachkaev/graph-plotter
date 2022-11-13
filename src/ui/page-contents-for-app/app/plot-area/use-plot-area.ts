import * as React from "react";

import { PlotAreaContext } from "./plot-area-context";

export const usePlotArea = () => {
  const result = React.useContext(PlotAreaContext);
  if (!result) {
    throw new Error("Cannot call usePlotArea() outside <PlotAreaProvider />");
  }

  return result;
};
