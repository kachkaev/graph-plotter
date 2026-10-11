import { LRUCache } from "lru-cache";

import { parseFormula } from "./parse-formula";
import type { FormulaParseResult } from "./types";

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
