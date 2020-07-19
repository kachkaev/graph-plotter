export const parseNumericValue = (rawValue: string): number => {
  const rawValueWithoutSpaces = rawValue.replace(/\s/g, "");
  const result = parseFloat(rawValueWithoutSpaces);
  if (result.toString() !== rawValueWithoutSpaces) {
    return NaN;
  }
  return result;
};
