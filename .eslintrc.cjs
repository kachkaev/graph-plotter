/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  extends: ["@kachkaev/eslint-config-react"],
  rules: {
    "id-length": "off",
    "import/no-default-export": "error",
    "no-restricted-syntax": "off",
    "unicorn/filename-case": "off",
    "unicorn/no-null": "off",
    "unicorn/prefer-number-properties": "off",
  },
  overrides: [
    {
      files: ["src/pages/**"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
