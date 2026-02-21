/// <reference types="jest" />

// Test setup file
// Configure global test environment

// Increase timeout for integration tests
jest.setTimeout(10000)

// Mock environment variables for testing
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.AUTH_BYPASS = 'false'

// Suppress console logs during tests unless there's an error
const originalConsole = { ...console }
global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error for debugging
    error: originalConsole.error,
}
