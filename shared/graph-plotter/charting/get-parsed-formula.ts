import { LRUCache } from "lru-cache";

import type { ErrorConfig } from "../shared/errors";
import { parseFormula } from "./parse-formula";
import type { Formula } from "./types";

type FormulaParseResult = Formula | ErrorConfig[];

const formulaCache = new LRUCache<string, FormulaParseResult>({ max: 100 });

export function getParsedFormula(rawFormula: string): FormulaParseResult {
  const entry = formulaCache.get(rawFormula);
  if (entry) {
    return entry;
  }

  const newEntry = parseFormula(rawFormula);
  formulaCache.set(rawFormula, newEntry);

  return newEntry;
}
