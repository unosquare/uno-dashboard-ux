module.exports = {
    ignorePatterns: ['*.test.ts', '*.spec.tsx', 'zustand.ts', 'sample/RegularTable.tsx'],
    settings: {
        'import/resolver': {
            node: {
                paths: ['./src'],
            },
        },
    },
    env: {
        es2021: true,
        browser: true,
        jest: true,
    },
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    extends: 'eslint-config-unosquare',
    plugins: ['eslint-plugin-prettier'],
    rules: {
        'react-hooks/exhaustive-deps': 'warn',
        'no-param-reassign': 'warn',
        'spaced-comment': 'warn',
        'import/prefer-default-export': 'off',
        'react/function-component-definition': [
            'error',
            { unnamedComponents: 'arrow-function', namedComponents: 'arrow-function' },
        ],
        'array-callback-return': ['error', { checkForEach: true }],
        'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
        'react/display-name': 'off',
    },
};
