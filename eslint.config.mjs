// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  // Global ignores
  globalIgnores(["!**/*", "dist/**", "node_modules/**", ".angular/**"]),

  // TypeScript files
  {
    files: ["**/*.ts"],
    ignores: ["*.d.ts"],
    extends: compat.extends(
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended", // This integrates Prettier with ESLint
    ),

    languageOptions: {
      ecmaVersion: 2022, // Updated to more modern value
      sourceType: "module", // Changed from "script" to "module"

      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        createDefaultProgram: true,
      },
    },

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],

      // Prettier integration
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "es5",
          printWidth: 100,
          semi: true,
          bracketSpacing: true,
          endOfLine: "auto",
        },
        {
          usePrettierrc: true, // Use .prettierrc.json if it exists
        },
      ],

      // Additional rules can be added here
    },
  },

  // HTML files
  {
    files: ["**/*.html"],
    extends: compat.extends(
      "plugin:@angular-eslint/template/recommended",
      "plugin:prettier/recommended", // Add Prettier for HTML
    ),

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      "prettier/prettier": [
        "error",
        {
          parser: "angular",
          htmlWhitespaceSensitivity: "css",
          bracketSameLine: false,
        },
      ],
    },
  },

  // Explicitly exclude SCSS files from prettier plugin
  {
    files: ["**/*.scss"],
    plugins: {
      // Remove prettier plugin for SCSS files
    },
    rules: {
      // Disable prettier rules for SCSS files
      "prettier/prettier": "off",
    },
  },

  // Add JSON support
  {
    files: ["**/*.json"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          parser: "json",
        },
      ],
    },
  },
]);
