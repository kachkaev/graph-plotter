import * as React from "react";

import type { PlotAreaContextValue } from "./types";

export const PlotAreaContext = React.createContext<
  PlotAreaContextValue | undefined
>(undefined);
