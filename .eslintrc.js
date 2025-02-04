// .eslintrc.js
module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // <--- This tells Babel parser not to require a config file.
    babelOptions: {
      presets: ['module:@react-native/babel-preset'],
      plugins: ['nativewind/babel'],
    },
  },
  env: {
    es6: true,
    node: true,
    'react-native/react-native': true,
  },
  extends: [
    // your other extends, e.g., 'eslint:recommended', 'plugin:react/recommended', etc.
  ],
  rules: {
    // your custom rules...
  },
};
