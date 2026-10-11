export type FormulaFunction = {
  minArgumentCount: number;
  maxArgumentCount: number;

  /**
   * Prefix functions can skip brackets around a single argument, e.g. `sin x`
   */
  isPrefix: boolean;

  evaluate: (...args: number[]) => number;
};

// Lanczos approximation with the same coefficients as in math.js and expr-eval,
// so that `gamma` and `!` produce the same values as before
const gammaG = 4.7421875;
const gammaCoefficients = [
  57.15623566586292, -59.59796035547549, 14.136097974741746,
  -0.4919138160976202, 3.399464998481189e-5, 4.652362892704858e-5,
  -9.837447530487956e-5, 1.580887032249125e-4, -2.1026444172410488e-4,
  2.1743961811521265e-4, -1.643181065367639e-4, 8.441822398385275e-5,
  -2.6190838401581408e-5, 3.6899182659531625e-6,
];

export function gamma(value: number): number {
  if (Number.isSafeInteger(value)) {
    if (value <= 0 || value > 171) {
      return Infinity;
    }
    let result = 1;
    for (let factor = value - 1; factor > 1; factor -= 1) {
      result *= factor;
    }

    return result;
  }

  if (Number.isNaN(value) || value === -Infinity) {
    return NaN;
  }
  if (value < 0.5) {
    return Math.PI / (Math.sin(Math.PI * value) * gamma(1 - value));
  }
  if (value >= 171.35) {
    return Infinity;
  }
  if (value > 85) {
    // Extended Stirling approximation
    const value2 = value * value;
    const value3 = value2 * value;
    const value4 = value3 * value;
    const value5 = value4 * value;

    return (
      Math.sqrt((2 * Math.PI) / value) *
      (value / Math.E) ** value *
      (1 +
        1 / (12 * value) +
        1 / (288 * value2) -
        139 / (51_840 * value3) -
        571 / (2_488_320 * value4) +
        163_879 / (209_018_880 * value5) +
        5_246_819 / (75_246_796_800 * value5 * value))
    );
  }

  const shiftedValue = value - 1;
  let sum = 0.9999999999999971;
  for (const [index, coefficient] of gammaCoefficients.entries()) {
    sum += coefficient / (shiftedValue + index + 1);
  }
  const base = shiftedValue + gammaG + 0.5;

  return (
    Math.sqrt(2 * Math.PI) *
    base ** (shiftedValue + 0.5) *
    Math.exp(-base) *
    sum
  );
}

export function factorial(value: number): number {
  return gamma(value + 1);
}

/**
 * Rounds to the given number of decimal places via exponent shifts, so that
 * float artefacts do not get in the way (1.005 → 1.01 and not 1)
 */
export function roundTo(value: number, decimalPlaces = 0): number {
  if (decimalPlaces === 0) {
    return Math.round(value);
  }
  if (!Number.isSafeInteger(decimalPlaces)) {
    return NaN;
  }

  const [mantissa, exponent = "0"] = String(value).split("e", 2);
  const shifted = Math.round(
    Number(`${mantissa}e${Number(exponent) + decimalPlaces}`),
  );
  const [shiftedMantissa, shiftedExponent = "0"] = String(shifted).split(
    "e",
    2,
  );

  return Number(
    `${shiftedMantissa}e${Number(shiftedExponent) - decimalPlaces}`,
  );
}

function defineFunctions(
  isPrefix: boolean,
  minArgumentCount: number,
  maxArgumentCount: number,
  entries: Array<[string, (...args: number[]) => number]>,
): Array<[string, FormulaFunction]> {
  return entries.map(([name, evaluate]) => [
    name,
    { minArgumentCount, maxArgumentCount, isPrefix, evaluate },
  ]);
}

export const formulaFunctions = new Map<string, FormulaFunction>([
  ...defineFunctions(true, 1, 1, [
    ["abs", Math.abs],
    ["acos", Math.acos],
    ["acosh", Math.acosh],
    ["asin", Math.asin],
    ["asinh", Math.asinh],
    ["atan", Math.atan],
    ["atanh", Math.atanh],
    ["cbrt", Math.cbrt],
    ["ceil", Math.ceil],
    ["cos", Math.cos],
    ["cosh", Math.cosh],
    ["exp", Math.exp],
    ["expm1", Math.expm1],
    ["floor", Math.floor],
    ["lg", Math.log10],
    ["ln", Math.log],
    ["log", Math.log],
    ["log10", Math.log10],
    ["log1p", Math.log1p],
    ["log2", Math.log2],
    ["not", (value) => Number(!value)],
    ["round", Math.round],
    ["sign", Math.sign],
    ["sin", Math.sin],
    ["sinh", Math.sinh],
    ["sqrt", Math.sqrt],
    ["tan", Math.tan],
    ["tanh", Math.tanh],
    ["trunc", Math.trunc],
  ]),
  ...defineFunctions(false, 0, 1, [
    ["random", (max = 1) => Math.random() * (max || 1)],
  ]),
  ...defineFunctions(false, 1, 1, [
    ["fac", factorial],
    ["gamma", gamma],
  ]),
  ...defineFunctions(false, 1, 2, [["roundTo", roundTo]]),
  ...defineFunctions(false, 2, 2, [
    ["atan2", Math.atan2],
    ["pow", (base, exponent) => base ** exponent],
  ]),
  ...defineFunctions(false, 3, 3, [
    [
      "if",
      (condition, consequent, alternate) =>
        condition ? consequent : alternate,
    ],
  ]),
  ...defineFunctions(false, 1, Infinity, [
    ["hypot", Math.hypot],
    ["max", Math.max],
    ["min", Math.min],
    ["pyt", Math.hypot],
  ]),
]);

export const formulaConstants = new Map<string, number>([
  ["E", Math.E],
  ["e", Math.E],
  ["PI", Math.PI],
  ["pi", Math.PI],
  ["false", 0],
  ["true", 1],
]);
