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
    testMatch: ['<rootDir>/src/**/*.spec.tsx', '<rootDir>/src/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.tsx'],
    moduleNameMapper: {
        '@tremor/react/dist/(.*)$': '<rootDir>/node_modules/@tremor/react/dist/$1.cjs',
    },
};
