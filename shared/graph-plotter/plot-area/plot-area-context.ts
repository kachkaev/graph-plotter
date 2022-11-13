import * as React from "react";

import { PlotAreaContextValue } from "./types";

export const PlotAreaContext = React.createContext<
  PlotAreaContextValue | undefined
>(undefined);
