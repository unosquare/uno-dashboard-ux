/** @type {import('jest').Config} */

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageReporters: ['lcov', 'text'],
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    testMatch: ['<rootDir>/src/**/*.spec.tsx'],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    moduleNameMapper: {
        '@tremor/react/dist/lib/utils': require.resolve('@tremor/react/dist/lib/utils.cjs'),
        '@tremor/react/dist/lib/theme': require.resolve('@tremor/react/dist/lib/theme.cjs'),
        '@tremor/react/dist/lib/tremorTwMerge': require.resolve('@tremor/react/dist/lib/tremorTwMerge.cjs'),
        '@tremor/react/dist/lib/sizing': require.resolve('@tremor/react/dist/lib/sizing.cjs'),
        '@tremor/react/dist/lib/shape': require.resolve('@tremor/react/dist/lib/shape.cjs'),
    },
};
