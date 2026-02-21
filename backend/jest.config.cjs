/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: '<rootDir>/tsconfig.test.json',
        }],
    },
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.spec.ts',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    collectCoverageFrom: [
        'server/**/*.ts',
        '!server/**/*.d.ts',
        '!server/**/index.ts',
        '!server/vite.ts',
        '!server/test-*.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    coverageDirectory: '<rootDir>/coverage',
    verbose: true,
    testTimeout: 10000,
    // Clear mocks between tests
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
