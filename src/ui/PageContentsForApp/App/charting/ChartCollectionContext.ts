import React from "react";

import { ChartCollectionContextValue } from "./types";

export const ChartCollectionContext = React.createContext<
  ChartCollectionContextValue | undefined
>(undefined);
