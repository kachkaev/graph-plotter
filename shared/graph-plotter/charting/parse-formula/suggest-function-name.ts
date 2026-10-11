import { formulaFunctions } from "./functions";

// Names from the Flash version of the app and from textbooks
const functionNameSuggestions = new Map<string, string>([
  ["arccos", "acos"],
  ["arccosh", "acosh"],
  ["arch", "acosh"],
  ["arcsin", "asin"],
  ["arcsinh", "asinh"],
  ["arctan", "atan"],
  ["arctanh", "atanh"],
  ["arctg", "atan"],
  ["arsh", "asinh"],
  ["arth", "atanh"],
  ["ch", "cosh"],
  ["random2", "random"],
  ["sgn", "sign"],
  ["sh", "sinh"],
  ["tg", "tan"],
  ["th", "tanh"],
]);

export function suggestFunctionName(name: string): string | undefined {
  const lowerCaseName = name.toLowerCase();
  const suggestion = functionNameSuggestions.get(lowerCaseName);
  if (suggestion) {
    return suggestion;
  }

  // Catches wrong letter case, e.g. `Sin` or `SQRT`
  for (const functionName of formulaFunctions.keys()) {
    if (functionName.toLowerCase() === lowerCaseName) {
      return functionName;
    }
  }

  return undefined;
}
