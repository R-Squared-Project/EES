module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "max-len": ["warn", { code: 120 }],
  },
  root: true,
  env: {
    node: true,
  },
};
