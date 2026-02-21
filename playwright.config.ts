import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration
 * Tests critical user flows across multiple browsers
 */
export default defineConfig({
    // Test directory
    testDir: './e2e',

    // Timeout for each test
    timeout: 30 * 1000,

    // Expect timeout for assertions
    expect: {
        timeout: 5000
    },

    // Run tests in files in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter configuration
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'playwright-report/test-results.json' }],
        ['list']
    ],

    // Shared settings for all projects
    use: {
        // Base URL for all tests
        baseURL: process.env.BASE_URL || 'http://localhost:3000',

        // Collect trace on failure
        trace: 'on-first-retry',

        // Screenshots on failure
        screenshot: 'only-on-failure',

        // Video on retry
        video: 'retain-on-failure',
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        // Mobile testing
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // Run local dev server before starting tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
