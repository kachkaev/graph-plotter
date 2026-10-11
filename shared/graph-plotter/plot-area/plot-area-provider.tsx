import { produce } from "immer";
import * as React from "react";
import { useLocalStorage } from "react-use";

import { defaultRawPlotAreaConfig } from "./default-raw-plot-area-config";
import { PlotAreaContext } from "./plot-area-context";
import { processRawPlotAreaConfig } from "./process-raw-plot-area-config";
import type {
  PlotAreaContextValue,
  RawPlotAreaConfig,
  UpdateRawPlotAreaConfig,
} from "./types";

export function PlotAreaProvider({ children }: { children?: React.ReactNode }) {
  const [savedRawPlotAreaConfig, saveRawPlotAreaConfig] =
    useLocalStorage<RawPlotAreaConfig>("gp.plotAreaConfig");

  const [rawPlotAreaConfig, setRawPlotAreaConfig] = React.useState(
    savedRawPlotAreaConfig ?? defaultRawPlotAreaConfig,
  );
  React.useEffect(() => {
    saveRawPlotAreaConfig(rawPlotAreaConfig);
  }, [rawPlotAreaConfig, saveRawPlotAreaConfig]);

  const updateRawPlotAreaConfig = React.useCallback<UpdateRawPlotAreaConfig>(
    (updateFn) => {
      setRawPlotAreaConfig((prevValue) => produce(prevValue, updateFn));
    },
    [setRawPlotAreaConfig],
  );

  const contextValue = React.useMemo<PlotAreaContextValue>(() => {
    const plotAreaConfig = processRawPlotAreaConfig(rawPlotAreaConfig);

    return {
      rawPlotAreaConfig,
      plotAreaConfig,
      updateRawPlotAreaConfig,
    };
  }, [rawPlotAreaConfig, updateRawPlotAreaConfig]);

  return <PlotAreaContext value={contextValue}>{children}</PlotAreaContext>;
}
