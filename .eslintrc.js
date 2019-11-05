module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["react-app"],
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-angle-bracket-type-assertion": 0,
        "quotes": ["error"],
        "no-console": "off",
        "accessor-pairs": "OFF",
        "arrow-spacing": "ERROR",
        "brace-style": ["ERROR", "1tbs"],
        "comma-dangle": ["ERROR", "always-multiline"],
        "consistent-return": "OFF",
        "dot-location": ["ERROR", "property"],
        "dot-notation": "ERROR",
        "eol-last": "ERROR",
        "eqeqeq": ["ERROR", "allow-null"],
        "indent": ["ERROR", 4, {"SwitchCase": 1}],
        "jsx-quotes": ["ERROR", "prefer-double"],
        "key-spacing": ["ERROR"],
        "keyword-spacing": [
            "ERROR",
            {
                "after": true,
                "before": true
            }
        ],
        "no-inner-declarations": ["ERROR", "functions"],
        "no-multi-spaces": "ERROR",
        "no-multiple-empty-lines": ["error", {"max": 1}],
        "no-restricted-syntax": ["ERROR", "WithStatement"],
        "no-shadow": "WARN",
        "no-unused-expressions": "ERROR",
        "no-unused-vars": [
            "ERROR",
            {"args": "none"}
        ],
        "no-use-before-define": [
            "ERROR",
            {
                "functions": false,
                "variables": false
            }
        ],
        "no-useless-concat": "OFF",
        "object-curly-spacing": ["ERROR", "never"],
        "space-before-blocks": "ERROR",
        "space-before-function-paren": "off",
        "space-infix-ops": ["error"],
        "space-in-parens": ["error", "never"],
        "spaced-comment": ["error", "always", {"exceptions": ["-", "+"]}],
        "valid-typeof": [
            "ERROR",
            {"requireStringLiterals": true}
        ],
        "no-var": "ERROR",
        "react/jsx-boolean-value": ["ERROR", "always"],
        "react/jsx-no-undef": "ERROR",
        "react/jsx-sort-prop-types": "OFF",
        "react/jsx-tag-spacing": "ERROR",
        "react/jsx-uses-react": "ERROR",
        "react/no-is-mounted": "OFF",
        "react/react-in-jsx-scope": "ERROR",
        "react/self-closing-comp": "ERROR",
        "react/jsx-wrap-multilines": [
            "ERROR",
            {
                "declaration": false,
                "assignment": false
            }
        ],
        "react/no-direct-mutation-state": "ERROR",
        "react/jsx-no-duplicate-props": ["ERROR", {"ignoreCase": true}],
        "react/forbid-prop-types": ["WARN"],
        "react/destructuring-assignment": "ERROR",
    }
};
