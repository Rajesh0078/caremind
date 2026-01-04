import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "off",

      // ===== Style =====
      "no-trailing-spaces": "error",
      "semi": ["error", "always"],
      "indent": ["error", 2, {
        "SwitchCase": 1,
        "VariableDeclarator": 1,
        "outerIIFEBody": 1
      }],
      "linebreak-style": ["error", "unix"],
      "object-curly-spacing": ["error", "always"],

      // ===== Best practices =====
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"]
    }
  },
]);
