import * as React from "react";

import type { ChartCollectionContextValue } from "./types";

export const ChartCollectionContext = React.createContext<
  ChartCollectionContextValue | undefined
>(undefined);
