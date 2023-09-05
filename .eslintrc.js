module.exports = {
  parser: "vue-eslint-parser",
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  overrides: [{
    files: '*.vue',
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }]
}