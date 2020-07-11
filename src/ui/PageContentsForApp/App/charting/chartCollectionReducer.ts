import produce from "immer";
import React from "react";
import { v4 as uuidv4 } from "uuid";

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
      case "updateActiveItem": {
        if (draft.activeItemId) {
          const itemIndex = draft.items.findIndex(
            (chartItem) => chartItem.id === draft.activeItemId,
          );
          draft.items[itemIndex].rawConfig = action.rawChartConfig;
        } else {
          const id = uuidv4();
          draft.items.push({
            id,
            rawConfig: action.rawChartConfig,
          });
          draft.activeItemId = id;
        }
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
