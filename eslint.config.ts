import { generateNextConfigs } from "@kachkaev/eslint-config-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  generateNextConfigs(),
  {
    // Pages Router requires default exports for pages
    files: ["pages/**/*.tsx"],
    rules: {
      "import/no-default-export": "off",
    },
  },
]);
