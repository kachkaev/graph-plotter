import produce from "immer";
import React from "react";

import { defaultRawPlotAreaConfig } from "./defaultRawPlotAreaConfig";
import { PlotAreaContext } from "./PlotAreaContext";
import { processRawPlotAreaConfig } from "./processRawPlotAreaConfig";
import { PlotAreaContextValue, UpdateRawPlotAreaConfig } from "./types";

export const PlotAreaProvider: React.FunctionComponent = ({ children }) => {
  const [rawPlotAreaConfig, setRawConfig] = React.useState(
    defaultRawPlotAreaConfig,
  );

  const updateRawPlotAreaConfig = React.useCallback<UpdateRawPlotAreaConfig>(
    (updateFn) => {
      setRawConfig((prevValue) => produce(prevValue, updateFn));
    },
    [setRawConfig],
  );

  const contextValue = React.useMemo<PlotAreaContextValue>(() => {
    const plotAreaConfig = processRawPlotAreaConfig(rawPlotAreaConfig);
    return {
      rawPlotAreaConfig,
      plotAreaConfig,
      updateRawPlotAreaConfig,
    };
  }, [rawPlotAreaConfig, updateRawPlotAreaConfig]);

  return (
    <PlotAreaContext.Provider value={contextValue}>
      {children}
    </PlotAreaContext.Provider>
  );
};
