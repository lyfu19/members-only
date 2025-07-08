module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended", // 开启 Prettier 插件 + 关闭冲突规则
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error", // 格式错误也当作 ESLint 错
    "consistent-return": "off",
    camelcase: "off",
    "no-console": "off",
  },
};
