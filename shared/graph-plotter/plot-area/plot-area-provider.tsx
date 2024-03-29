import produce from "immer";
import * as React from "react";
import { useLocalStorage } from "react-use";

import { defaultRawPlotAreaConfig } from "./default-raw-plot-area-config";
import { PlotAreaContext } from "./plot-area-context";
import { processRawPlotAreaConfig } from "./process-raw-plot-area-config";
import {
  PlotAreaContextValue,
  RawPlotAreaConfig,
  UpdateRawPlotAreaConfig,
} from "./types";

export const PlotAreaProvider: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [savedRawPlotAreaConfig, saveRawPlotAreaConfig] =
    useLocalStorage<RawPlotAreaConfig>("gp.plotAreaConfig");

  const [rawPlotAreaConfig, setRawConfig] = React.useState(
    savedRawPlotAreaConfig ?? defaultRawPlotAreaConfig,
  );
  React.useEffect(() => {
    saveRawPlotAreaConfig(rawPlotAreaConfig);
  }, [rawPlotAreaConfig, saveRawPlotAreaConfig]);

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
