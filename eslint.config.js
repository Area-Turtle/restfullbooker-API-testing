const js = require("@eslint/js");
const globals = require("globals");
const security = require("eslint-plugin-security");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  js.configs.recommended,

  {
    plugins: {
      security
    },

    rules: {
      ...security.configs.recommended.rules
    }
  },
  // Node.js files
  {
    files: [
      "server.js",
      "eslint.config.js",
      "jest.config.js"
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025
      }
    }
  },

  // Browser JavaScript
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  // Jest unit tests
  {
    files: ["tests/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2025,
        fetch: "readonly"
      }
    }
  }
]);