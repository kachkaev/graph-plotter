import * as React from "react";

import { PlotAreaContext } from "./plot-area-context";
import type { PlotAreaContextValue } from "./types";

export function usePlotArea(): PlotAreaContextValue {
  const result = React.use(PlotAreaContext);
  if (!result) {
    throw new Error("Cannot call usePlotArea() outside <PlotAreaProvider />");
  }

  return result;
}
