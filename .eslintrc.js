module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base", // ya da 'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // Örnek: noktalı virgül zorunlu kılma
    semi: ["error", "always"],
    // Örnek: console.log hata verme
    "no-console": "off",
  },
};
