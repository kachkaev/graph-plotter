import LRU from "lru-cache";

import { ErrorConfig } from "../shared/errors";
import { parseFormula } from "./parseFormula";
import { Formula } from "./types";

type FormulaParseResult = Formula | ErrorConfig[];

const formulaCache = new LRU<string, FormulaParseResult>(100);

export const getParsedFormula = (rawFormula: string): FormulaParseResult => {
  const entry = formulaCache.get(rawFormula);
  if (entry) {
    return entry;
  }

  const newEntry = parseFormula(rawFormula);
  formulaCache.set(rawFormula, newEntry);

  return newEntry;
};
