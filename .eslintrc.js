module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'operator-linebreak': ['error', 'after'],
    'implicit-arrow-linebreak': ['off'],
    'function-paren-newline': ['off'],
    'func-names': ['off'],
    'no-underscore-dangle': ['off'],
  },
};
