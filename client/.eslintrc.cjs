module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "@feature-sliced"
  ],
  "parser": "@typescript-eslint/parser",
  "ignorePatterns": ["dist"]
}