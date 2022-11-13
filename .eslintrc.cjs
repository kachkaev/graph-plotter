/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  extends: [
    "@kachkaev/eslint-config-react",
    "@kachkaev/eslint-config-react/extra-type-checking",
    "plugin:@next/next/recommended",
  ],
  rules: {
    "no-restricted-syntax": "off",
  },
};
