import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const tseslint = require("typescript-eslint");
const noRestrictedTypesRule = tseslint.plugin.rules["no-restricted-types"];

const banTypesCompatRule = {
  meta: {
    ...noRestrictedTypesRule.meta,
    schema: [
      {
        type: "object",
        properties: {
          extendDefaults: {
            type: "boolean",
          },
          types: {
            type: "object",
            additionalProperties: {
              anyOf: [
                {
                  type: "boolean",
                  enum: [true, false],
                },
                {
                  type: "string",
                },
                {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    fixWith: {
                      type: "string",
                    },
                    suggest: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context, options) {
    const [ruleOptions = {}] = options ?? [];

    const transformedTypes = Object.fromEntries(
      Object.entries(ruleOptions.types ?? {}).filter(([, value]) => value !== false),
    );

    return noRestrictedTypesRule.create(context, [{ types: transformedTypes }]);
  },
};

tseslint.plugin.rules["ban-types"] = banTypesCompatRule;

const nextTypescriptConfig = nextTs;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescriptConfig,
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {},
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "jsx-a11y/alt-text": "off",
      "react/display-name": "off",
      "react/no-children-prop": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "lines-around-comment": [
        "error",
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "any",
          prev: "export",
          next: "export",
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["function", "multiline-const", "multiline-block-like"],
        },
        {
          blankLine: "always",
          prev: ["function", "multiline-const", "multiline-block-like"],
          next: "*",
        },
      ],
      "newline-before-return": "error",
      "import/newline-after-import": [
        "error",
        {
          count: 1,
        },
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", ["internal", "parent", "sibling", "index"], ["object", "unknown"]],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "~/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "type"],
          "newlines-between": "always-and-inside-groups",
        },
      ],
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            Function: "Use a specific function type instead",
            Object: "Use object instead",
            Boolean: "Use boolean instead",
            Number: "Use number instead",
            String: "Use string instead",
            Symbol: "Use symbol instead",
            any: false,
            "{}": false,
          },
        },
      ],
    },
  },
  {
    files: ["*.ts", "*.tsx", "src/iconify-bundle/*"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/**/*.test.tsx",
    "src/**/*.test.jsx",
  ]),
]);

export default eslintConfig;
