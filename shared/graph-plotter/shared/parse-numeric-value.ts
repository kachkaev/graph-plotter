export function parseNumericValue(rawValue: string): number {
  const rawValueWithoutSpaces = rawValue.replaceAll(/\s/g, "");
  const result = Number(rawValueWithoutSpaces);
  if (result.toString() !== rawValueWithoutSpaces) {
    return NaN;
  }

  return result;
}
