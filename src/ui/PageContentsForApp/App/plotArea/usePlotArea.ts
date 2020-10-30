import React from "react";

import { PlotAreaContext } from "./PlotAreaContext";

export const usePlotArea = () => {
  const result = React.useContext(PlotAreaContext);
  if (!result) {
    throw new Error("Cannot call usePlotArea() outside <PlotAreaProvider />");
  }

  return result;
};
