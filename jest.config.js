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
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    testMatch: ['<rootDir>/src/**/*.spec.tsx', '<rootDir>/src/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.tsx'],
};
