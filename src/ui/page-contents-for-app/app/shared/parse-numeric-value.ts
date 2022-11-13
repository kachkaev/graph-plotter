export const parseNumericValue = (rawValue: string): number => {
  const rawValueWithoutSpaces = rawValue.replace(/\s/g, "");
  const result = Number.parseFloat(rawValueWithoutSpaces);
  if (result.toString() !== rawValueWithoutSpaces) {
    return Number.NaN;
  }

  return result;
};
