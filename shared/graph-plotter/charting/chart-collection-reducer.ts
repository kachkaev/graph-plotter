import { produce } from "immer";
<<<<<<< HEAD
||||||| 7d998c5
import produce from "immer";
import * as React from "react";
=======
import * as React from "react";
>>>>>>> origin/main

import { generateRawChartConfig } from "./generate-raw-chart-config";
import type { ChartCollection, ChartCollectionAction } from "./types";

export function chartCollectionReducer(
  chartCollection: ChartCollection,
  action: ChartCollectionAction,
): ChartCollection {
  return produce(chartCollection, (draft) => {
    switch (action.type) {
      case "addNewItem": {
        const rawChartConfig = generateRawChartConfig(chartCollection.items);
        const selectedItemIndex = draft.items.findIndex(
          (currentRawChartConfig) =>
            currentRawChartConfig.id === chartCollection.activeItemId,
        );

        const newItemIndex = selectedItemIndex === -1 ? 0 : selectedItemIndex;
        draft.items.splice(newItemIndex, 0, rawChartConfig);
        draft.activeItemId = rawChartConfig.id;
        break;
      }

      case "setActiveItem": {
        draft.activeItemId = action.itemId;
        break;
      }

      case "updateItem": {
        const rawChartConfig = action.rawChartConfig;
        const itemIndex = draft.items.findIndex(
          (currentRawChartConfig) =>
            currentRawChartConfig.id === draft.activeItemId,
        );
        if (itemIndex === -1) {
          draft.items.unshift(rawChartConfig);
        } else {
          draft.items[itemIndex] = rawChartConfig;
        }
        draft.activeItemId = rawChartConfig.id;
        break;
      }

      case "deleteItem": {
        const itemIndex = draft.items.findIndex(
          (chartItem) => chartItem.id === action.itemId,
        );
        if (itemIndex !== -1) {
          delete draft.activeItemId;
          draft.items.splice(itemIndex, 1);
          draft.activeItemId =
            draft.items[itemIndex]?.id ?? draft.items[itemIndex - 1]?.id;
        }
        break;
      }
    }
  });
}
