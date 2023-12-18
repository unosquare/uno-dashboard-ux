module.exports = {
    ignorePatterns: ['*.test.ts', '*.spec.tsx','zustand.ts'],
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
        'guard-for-in': 'warn',
        'react/require-default-props': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'no-param-reassign': 'warn',
        'spaced-comment': 'warn',
        'import/prefer-default-export': 'off',
        'react/no-array-index-key': 'warn',
        'react/function-component-definition': [
            'error',
            { unnamedComponents: 'arrow-function', namedComponents: 'arrow-function' },
        ],
        'array-callback-return': ['error', { checkForEach: true }],
        'sort-imports': [
            'warn',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                allowSeparatedGroups: false,
            },
        ],
        'react/no-unstable-nested-components': 'warn',
    },
};
