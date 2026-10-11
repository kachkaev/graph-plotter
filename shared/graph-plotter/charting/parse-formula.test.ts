import { describe, expect, test } from "vitest";

import { parseFormula } from "./parse-formula";
import type { Formula } from "./types";

const sampleXValues = [-10, -2.5, -1, -0.5, 0, 0.3, 1, 2, 7.5];

function parseValidFormula(rawFormula: string): Formula {
  const result = parseFormula(rawFormula);
  if (typeof result !== "function") {
    throw new TypeError(`Expected ${JSON.stringify(rawFormula)} to be valid`);
  }

  return result;
}

function expectSameNumber(actual: number, expected: number, message: string) {
  if (Number.isNaN(expected)) {
    expect(actual, message).toBeNaN();
  } else {
    expect(actual, message).toBeCloseTo(expected, 10);
  }
}

function expectFormulaToMatch(
  rawFormula: string,
  expected: (x: number) => number,
  xValues: number[] = sampleXValues,
) {
  const formula = parseValidFormula(rawFormula);
  for (const x of xValues) {
    expectSameNumber(formula(x), expected(x), `${rawFormula} at x = ${x}`);
  }
}

function expectFormulaToEqual(rawFormula: string, expected: number, x = 0) {
  expectSameNumber(parseValidFormula(rawFormula)(x), expected, rawFormula);
}

describe("numbers, variables and constants", () => {
  test.each<[string, number]>([
    ["42", 42],
    ["3.25", 3.25],
    [".5", 0.5],
    ["5.", 5],
    ["1e3", 1000],
    ["1.5e-3", 0.0015],
    ["2E+2", 200],
    ["pi", Math.PI],
    ["PI", Math.PI],
    ["e", Math.E],
    ["E", Math.E],
    ["true", 1],
    ["false", 0],
  ])("%s", (rawFormula, expected) => {
    expectFormulaToEqual(rawFormula, expected);
  });

  test("x", () => {
    expectFormulaToMatch("x", (x) => x);
  });

  test("whitespace and line breaks are ignored", () => {
    expectFormulaToMatch(" x\n+\t1\r\n ", (x) => x + 1);
    expectFormulaToMatch("x\u{A0}+\u{A0}1", (x) => x + 1);
  });

  test("deep nesting", () => {
    expectFormulaToMatch(`${"(".repeat(100)}x${")".repeat(100)}`, (x) => x);
    expect(() =>
      parseFormula(`${"(".repeat(100_000)}x${")".repeat(100_000)}`),
    ).not.toThrow();
  });
});

describe("operators", () => {
  test.each<[string, (x: number) => number]>([
    ["x + 1", (x) => x + 1],
    ["x - 1", (x) => x - 1],
    ["x − 1", (x) => x - 1],
    ["x * 2", (x) => x * 2],
    ["x ∙ 2", (x) => x * 2],
    ["x • 2", (x) => x * 2],
    ["x · 2", (x) => x * 2],
    ["x × 2", (x) => x * 2],
    ["x / 2", (x) => x / 2],
    ["x % 2", (x) => x % 2],
    ["x ^ 2", (x) => x ** 2],
    ["2 ^ x", (x) => 2 ** x],
    ["-x", (x) => -x],
    ["+x", (x) => x],
    ["--x", (x) => x],
    ["1 - -x", (x) => 1 + x],
    ["2 * -x", (x) => -2 * x],
  ])("%s", (rawFormula, expected) => {
    expectFormulaToMatch(rawFormula, expected);
  });

  test.each<[string, number]>([
    ["3!", 6],
    ["0!", 1],
    ["5!", 120],
    ["3!!", 720],
    ["0.5!", Math.sqrt(Math.PI) / 2],
    ["(-1)!", Infinity],
  ])("factorial: %s", (rawFormula, expected) => {
    expectFormulaToEqual(rawFormula, expected);
  });

  test.each<[string, number]>([
    ["1 + 2 * 3", 7],
    ["(1 + 2) * 3", 9],
    ["10 - 4 - 3", 3],
    ["64 / 4 / 2", 8],
    ["7 % 3 * 2", 2],
    ["-7 % 3", -1],
    ["2 ^ 3 ^ 2", 512],
    ["-2 ^ 2", -4],
    ["(-2) ^ 2", 4],
    ["2 ^ -1", 0.5],
    ["-3!", -6],
    ["3! ^ 2", 36],
    ["2 ^ 3!", 64],
    ["2 * 3!", 12],
  ])("precedence: %s", (rawFormula, expected) => {
    expectFormulaToEqual(rawFormula, expected);
  });
});

describe("comparisons, logic and conditions", () => {
  test.each<[string, (x: number) => number]>([
    ["x > 1", (x) => Number(x > 1)],
    ["x >= 1", (x) => Number(x >= 1)],
    ["x < 1", (x) => Number(x < 1)],
    ["x <= 1", (x) => Number(x <= 1)],
    ["x == 1", (x) => Number(x === 1)],
    ["x != 1", (x) => Number(x !== 1)],
    ["x > 0 and x < 1", (x) => Number(x > 0 && x < 1)],
    ["x < -1 or x > 2", (x) => Number(x < -1 || x > 2)],
    ["x > 0 and x < 1 or x > 2", (x) => Number((x > 0 && x < 1) || x > 2)],
    ["not x", (x) => Number(!x)],
    ["not (x > 0)", (x) => Number(!(x > 0))],
    ["x > 1 ? x : -x", (x) => (x > 1 ? x : -x)],
    ["x ? 1 : 2", (x) => (x ? 1 : 2)],
    ["x < 0 ? -1 : x > 0 ? 1 : 0", (x) => Math.sign(x)],
    ["(x > 0) * x", (x) => Number(x > 0) * x],
    ["sqrt(x) ? 1 : 2", (x) => (Math.sqrt(x) ? 1 : 2)],
    // expr-eval returned booleans here, so `(x > 0) == 1` was always 0
    ["(x > 0) == 1", (x) => Number(x > 0)],
    ["(x > 0) == true", (x) => Number(x > 0)],
  ])("%s", (rawFormula, expected) => {
    expectFormulaToMatch(rawFormula, expected);
  });
});

describe("functions", () => {
  const unaryFunctions: Record<string, (x: number) => number> = {
    abs: Math.abs,
    acos: Math.acos,
    acosh: Math.acosh,
    asin: Math.asin,
    asinh: Math.asinh,
    atan: Math.atan,
    atanh: Math.atanh,
    cbrt: Math.cbrt,
    ceil: Math.ceil,
    cos: Math.cos,
    cosh: Math.cosh,
    exp: Math.exp,
    expm1: Math.expm1,
    floor: Math.floor,
    lg: Math.log10,
    ln: Math.log,
    log: Math.log,
    log10: Math.log10,
    log1p: Math.log1p,
    log2: Math.log2,
    round: Math.round,
    sign: Math.sign,
    sin: Math.sin,
    sinh: Math.sinh,
    sqrt: Math.sqrt,
    tan: Math.tan,
    tanh: Math.tanh,
    trunc: Math.trunc,
  };

  test.each(Object.entries(unaryFunctions))("%s(x)", (name, implementation) => {
    expectFormulaToMatch(`${name}(x)`, implementation);
  });

  test.each<[string, (x: number) => number]>([
    ["sin x", (x) => Math.sin(x)],
    ["sin x ^ 2", (x) => Math.sin(x ** 2)],
    ["sin(x) ^ 2", (x) => Math.sin(x) ** 2],
    ["sin (x) ^ 2", (x) => Math.sin(x) ** 2],
    ["sin x * 2", (x) => Math.sin(x) * 2],
    ["sin x + 1", (x) => Math.sin(x) + 1],
    ["-sin x", (x) => -Math.sin(x)],
    ["cos sin x", (x) => Math.cos(Math.sin(x))],
    ["abs -x", (x) => Math.abs(-x)],
    ["sqrt(x ^ 2 + 1)", (x) => Math.sqrt(x ** 2 + 1)],
  ])("unary functions without brackets: %s", (rawFormula, expected) => {
    expectFormulaToMatch(rawFormula, expected);
  });

  test.each<[string, (x: number) => number]>([
    ["min(x, 0)", (x) => Math.min(x, 0)],
    ["min(1, x, -1)", (x) => Math.min(1, x, -1)],
    ["max(x, 0)", (x) => Math.max(x, 0)],
    ["max(1, 2, 3, x)", (x) => Math.max(1, 2, 3, x)],
    ["pow(x, 3)", (x) => x ** 3],
    ["atan2(x, 1)", (x) => Math.atan2(x, 1)],
    ["hypot(x, 1)", (x) => Math.hypot(x, 1)],
    ["pyt(x, 1)", (x) => Math.hypot(x, 1)],
    ["if(x > 0, 1, -1)", (x) => (x > 0 ? 1 : -1)],
    ["roundTo(x, 0)", (x) => Math.round(x)],
  ])("multi-argument functions: %s", (rawFormula, expected) => {
    expectFormulaToMatch(rawFormula, expected);
  });

  test.each<[string, number]>([
    ["roundTo(5.4321, 2)", 5.43],
    ["roundTo(1234.5, -2)", 1200],
    ["gamma(5)", 24],
    ["gamma(0.5)", Math.sqrt(Math.PI)],
    ["fac(4)", 24],
  ])("%s", (rawFormula, expected) => {
    expectFormulaToEqual(rawFormula, expected);
  });

  test("random()", () => {
    const formula = parseValidFormula("random()");
    const values = Array.from({ length: 100 }, () => formula(0));
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
    expect(new Set(values).size).toBeGreaterThan(1);
  });

  test("random(10)", () => {
    const formula = parseValidFormula("random(10)");
    for (let index = 0; index < 100; index += 1) {
      const value = formula(0);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
    }
  });
});

describe("examples", () => {
  test("wave", () => {
    const formula = parseValidFormula("x*random()+sin(x)");
    for (const x of sampleXValues) {
      const value = formula(x);
      expect(value).toBeGreaterThanOrEqual(Math.min(0, x) + Math.sin(x));
      expect(value).toBeLessThanOrEqual(Math.max(0, x) + Math.sin(x));
    }
  });

  test("heart", () => {
    expectFormulaToMatch(
      "(sqrt(cos(x/5))*cos(1000*x/5)+sqrt(abs(x/5))-0.4)*((4-((x/5)^2))^0.1)*5",
      (x) =>
        (Math.sqrt(Math.cos(x / 5)) * Math.cos((1000 * x) / 5) +
          Math.sqrt(Math.abs(x / 5)) -
          0.4) *
        (4 - (x / 5) ** 2) ** 0.1 *
        5,
    );
  });

  test("heart with sqrt branches", () => {
    expectFormulaToMatch(
      "(sqrt(cos(x))*cos(300*x)+sqrt(abs(x))-0.7)*(4-x*x)^0.01",
      (x) =>
        (Math.sqrt(Math.cos(x)) * Math.cos(300 * x) +
          Math.sqrt(Math.abs(x)) -
          0.7) *
        (4 - x * x) ** 0.01,
    );
    expectFormulaToMatch("sqrt(6-x^2)", (x) => Math.sqrt(6 - x ** 2));
    expectFormulaToMatch("-sqrt(6-x^2)", (x) => -Math.sqrt(6 - x ** 2));
  });

  test("batman", () => {
    const rawFormula = `5 - abs(x) > 0
    ? abs(x) - 1.8 < 0
      ? ((0.3 * x - round(0.3 * x)) * x * 2 + 3) * sign(sin(180 * x))
      : sin(180 * x)
      ? ((0.3 * x - round(0.3 * x)) * x * 2 + 3) * sign(sin(180 * x))
      : sqrt(abs(x) ^ 2) * sqrt(5 - (x ^ 2)) - 3.8
    : sign(sin(180 * x)) * sqrt(87 - (x ^ 2))`;

    expectFormulaToMatch(
      rawFormula,
      (x) => {
        const ears =
          ((0.3 * x - Math.round(0.3 * x)) * x * 2 + 3) *
          Math.sign(Math.sin(180 * x));
        if (Math.abs(x) >= 5) {
          return Math.sign(Math.sin(180 * x)) * Math.sqrt(87 - x ** 2);
        }
        if (Math.abs(x) < 1.8 || Math.sin(180 * x)) {
          return ears;
        }
        return Math.abs(x) * Math.sqrt(5 - x ** 2) - 3.8;
      },
      Array.from({ length: 201 }, (_, index) => -10 + index / 10),
    );
  });

  test.each<[string, (x: number) => number]>([
    ["sin(x)/x", (x) => Math.sin(x) / x],
    ["1/x", (x) => 1 / x],
    ["x^3 - 3*x", (x) => x ** 3 - 3 * x],
    ["sqrt(1 - x^2)", (x) => Math.sqrt(1 - x ** 2)],
    ["abs(sin(x))", (x) => Math.abs(Math.sin(x))],
    ["exp(-x^2)", (x) => Math.exp(-(x ** 2))],
    [
      "e^(-x^2/2)/sqrt(2*pi)",
      (x) => Math.exp(-(x ** 2) / 2) / Math.sqrt(2 * Math.PI),
    ],
    ["floor(x) + 0.5", (x) => Math.floor(x) + 0.5],
    ["x - floor(x)", (x) => x - Math.floor(x)],
    ["sign(x) * sqrt(abs(x))", (x) => Math.sign(x) * Math.sqrt(Math.abs(x))],
    ["ln(abs(x))", (x) => Math.log(Math.abs(x))],
    ["tan(x)", (x) => Math.tan(x)],
    ["sin(1/x)", (x) => Math.sin(1 / x)],
    ["x*sin(x)", (x) => x * Math.sin(x)],
    ["abs(x) <= 2 ? x^2 : 4", (x) => (Math.abs(x) <= 2 ? x ** 2 : 4)],
  ])("%s", (rawFormula, expected) => {
    expectFormulaToMatch(rawFormula, expected);
  });
});

describe("invalid formulas", () => {
  test.each([
    "",
    " \t\n",
    "y",
    "X",
    "х", // Cyrillic
    "x2",
    "2x",
    "2 pi",
    "x x",
    "2(x)",
    "(x)(x)",
    "x(2)",
    "1.2.3",
    "2e",
    "x +",
    "* x",
    "(x",
    "x)",
    "()",
    "2 + ()",
    "sin(x",
    "sin()",
    "sin(x, 2)",
    "Sin(x)",
    "SIN(x)",
    "foo(x)",
    "|x|",
    "3,14",
    "x ? 1",
    "x ? 1 :",
  ])("%j", (rawFormula) => {
    expect(parseFormula(rawFormula)).not.toBeTypeOf("function");
  });
});

describe("expr-eval syntax that is no longer supported", () => {
  test.each([
    // Member access, a known way to reach JavaScript internals
    "x.constructor",
    "x.__proto__",
    "pi.toFixed",
    "max.call",
    "constructor",
    "__proto__",
    "toString(x)",
    "hasOwnProperty(x)",
    // Strings and arrays
    '"abc"',
    "'abc'",
    "[1, 2]",
    "[1, 2][0]",
    "x in [1, 2]",
    "x || 1",
    "length 123",
    "map(sin, [1, 2])",
    'join(",", [1, 2])',
    // Assignments, function definitions and statements
    "x = 1",
    "y = x",
    "f(t) = t * 2",
    "x; 1",
    // Comments and hex or binary numbers
    "x /* comment */",
    "0x1F",
    "0b11",
    // Function names without a call, which used to evaluate to NaN
    "sin",
    "max",
    "x ? 1 : sin",
    // Wrong number of arguments, which used to evaluate to NaN or garbage
    "pow(x)",
    "atan2(1)",
    "max()",
    "if(x, 1)",
    "random(1, 2)",
    "gamma()",
    // Unknown names in branches that are not taken at x = 0,
    // which used to break plotting at other values of x
    "x > 1 ? y : 0",
    "x > 1 ? foo(x) : 0",
  ])("%j", (rawFormula) => {
    expect(parseFormula(rawFormula)).not.toBeTypeOf("function");
  });
});

describe("error messages", () => {
  test.each<
    [
      rawFormula: string,
      code: number | string,
      highlightedText: string,
      values: Array<string | number>,
      hint?: string,
    ]
  >([
    ["", 1, "", [""]],
    [" \t", 1, " \t", [""]],
    ["x # 2", 3, "#", ["#"]],
    ["х + 1", 3, "х", ["х"], "x_rus"],
    ["|x|", 3, "|", ["|"], "vertical_slash"],
    ["y = x^2", "equal_presents", "=", ["="]],
    ["y", "y_in_f", "y", ["y"]],
    ["2*y + 1", "y_in_f", "y", ["y"]],
    ["x)", 20, ")", [")"]],
    ["(x", 21, "", [1]],
    ["sin((x)", 21, "", [1]],
    ["(x)(x)", 22, "(", ["("]],
    ["()", 23, "()", ["()"]],
    ["2 + ()", 23, "()", ["()"]],
    ["1.2.3", 32, "1.2.3", ["1.2.3"]],
    ["1e999", 39, "1e999", ["1e999"]],
    ["3,14", 33, ",", [","], "comma"],
    ["(1, 2)", 33, ",", [","], "comma"],
    ["foo(x)", 34, "foo", ["foo"]],
    ["tg(x)", 34, "tg", ["tg"], "func_name_hint tg tan"],
    ["Sin(x)", 34, "Sin", ["Sin"], "func_name_hint Sin sin"],
    ["Sin x", 31, "Sin", ["Sin"], "func_name_hint Sin sin"],
    ["foo", 31, "foo", ["foo"]],
    ["X", 31, "X", ["X"]],
    ["x(2)", 35, "x", ["x"]],
    ["pi(2)", 36, "pi", ["pi"]],
    ["sin", 37, "sin", ["sin"]],
    ["sin^2 x", 37, "sin", ["sin"]],
    ["max", 37, "max", ["max"]],
    ["2 * max + 1", 37, "max", ["max"]],
    ["2x", 38, "x", ["x"]],
    ["2 pi", 38, "pi", ["pi"]],
    ["sin(x)cos(x)", 38, "cos", ["cos"]],
    ["2(x)", 38, "(", ["("]],
    ["x ? 1", 40, "?", ["?"]],
    ["x : 1", 40, ":", [":"]],
    ["x +", 41, "+", ["+"]],
    ["x and", 41, "and", ["and"]],
    ["x ? 1 :", 41, ":", [":"]],
    ["* x", 42, "*", ["*"]],
    ["and x", 42, "and", ["and"]],
    ["(x +)", 43, "+", ["+"]],
    ["(* x)", 44, "*", ["*"]],
    ["max(x +, 1)", 45, "+", ["+"]],
    ["max(x, * 1)", 46, "*", ["*"]],
    ["x * / 2", 47, "/", ["/"]],
    ["roundTo(x, 1, 2)", 51, "roundTo(x, 1, 2)", ["roundTo", 1, 2]],
    ["random(1, 2)", 51, "random(1, 2)", ["random", 0, 1]],
    ["pow(x, 1, 2)", 52, "pow(x, 1, 2)", ["pow", 2]],
    ["sin(x, 2)", 52, "sin(x, 2)", ["sin", 1]],
    ["max()", 54, "max()", ["max", 0]],
    ["roundTo()", 55, "roundTo()", ["roundTo", 1, 2]],
    ["sin()", 56, "sin()", ["sin", 1]],
    ["pow(x)", 56, "pow(x)", ["pow", 2]],
    ["max(, 1)", 57, ",", ["max"]],
    ["max(1, )", 58, ",", ["max"]],
    ["max(1,,2)", 58, ",", ["max"]],
  ])("%j", (rawFormula, code, highlightedText, values, hint) => {
    const result = parseFormula(rawFormula);
    if (typeof result === "function") {
      throw new TypeError(
        `Expected ${JSON.stringify(rawFormula)} to be invalid`,
      );
    }

    const { error, errorRange } = result;
    expect(error.i18nKey).toBe(
      typeof code === "number" ? `error.formula.${code}` : `error.${code}`,
    );
    expect(error.i18nValues.slice(0, 2)).toEqual([
      errorRange[0],
      errorRange[1] - errorRange[0],
    ]);
    expect(error.i18nValues.slice(2)).toEqual(values);
    expect(rawFormula.slice(...errorRange)).toBe(highlightedText);
    expect(
      error.hint
        ? [error.hint.i18nKey.slice(6), ...error.hint.i18nValues].join(" ")
        : undefined,
    ).toBe(hint);
  });

  test("too deep nesting", () => {
    const result = parseFormula(
      `${"(".repeat(100_000)}x${")".repeat(100_000)}`,
    );
    expect(
      typeof result === "function" ? undefined : result.error.i18nKey,
    ).toBe("error.formula.2");
  });
});
