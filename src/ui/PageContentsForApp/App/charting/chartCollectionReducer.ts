import produce from "immer";
import React from "react";

import { ChartCollection, ChartCollectionAction } from "./types";

export const chartCollectionReducer: React.Reducer<
  ChartCollection,
  ChartCollectionAction
> = (chartCollection, action) =>
  produce(chartCollection, (draft) => {
    switch (action.type) {
      case "setActiveItem": {
        draft.activeItemId = action.itemId;
        break;
      }

      case "updateItem": {
        const itemIndex = draft.items.findIndex(
          (rawChartConfig) => rawChartConfig.id === draft.activeItemId,
        );
        if (itemIndex === -1) {
          draft.items.push(action.rawChartConfig);
        } else {
          draft.items[itemIndex] = action.rawChartConfig;
        }
        draft.activeItemId = action.rawChartConfig.id;
        break;
      }

      case "deleteItem": {
        const itemIndex = draft.items.findIndex(
          (chartItem) => chartItem.id === action.itemId,
        );
        if (itemIndex !== -1) {
          delete draft.activeItemId;
          draft.items.splice(itemIndex, 1);
        }
        break;
      }
    }
  });
