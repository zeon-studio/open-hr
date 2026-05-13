import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const reactRulesDir = path.join(
  path.dirname(require.resolve("eslint-plugin-react/package.json")),
  "lib/rules",
);

const disabledReactRules = fs
  .readdirSync(reactRulesDir)
  .filter((fileName) => fileName.endsWith(".js"))
  .map((fileName) => `react/${path.basename(fileName, ".js")}`);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // General
      "prefer-const": "warn",

      ...Object.fromEntries(disabledReactRules.map((rule) => [rule, "off"])),
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",

      // React
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["src/app/**/*.{js,jsx,ts,tsx}", "src/layouts/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Import feature code through the feature entrypoint only: @/features/<feature>",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Use relative imports inside a feature, and public entrypoints for cross-feature usage",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/shared/**/*.{js,jsx,ts,tsx}",
      "src/lib/**/*.{js,jsx,ts,tsx}",
      "src/config/**/*.{js,jsx,ts,tsx}",
      "src/types/**/*.{js,jsx,ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/*/*"],
              message:
                "Shared, config, and type layers must not depend on feature modules",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
