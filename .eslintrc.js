module.exports = {
    
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/essential",
        "eslint:recommended"
    ],
    rules: {
        "no-console": 0,
        "prefer-const": 2,
        "no-var": 2,
        "quotes": ["error", "double"]
    },
    parserOptions: {
        parser: "babel-eslint"
    }
}