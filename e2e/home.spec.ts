import { test, expect } from '@playwright/test';

/**
 * Home Page E2E Tests
 * Tests critical functionality of the home page
 */

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/gadizone/);
    });

    test('should display header navigation', async ({ page }) => {
        const header = page.locator('header');
        await expect(header).toBeVisible();

        // Check for key navigation links
        await expect(page.getByRole('link', { name: /new cars/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /brands/i })).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
        // Wait for hero section to load
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();
    });

    test('should display popular cars section', async ({ page }) => {
        // Wait for popular cars to load
        await page.waitForSelector('text=/Popular Cars/i', { timeout: 10000 });

        const popularSection = page.locator('text=/Popular Cars/i').locator('..');
        await expect(popularSection).toBeVisible();
    });

    test('should display brand section', async ({ page }) => {
        // Wait for brands section
        await page.waitForSelector('text=/Browse by Brand/i', { timeout: 10000 });

        const brandSection = page.locator('text=/Browse by Brand/i').locator('..');
        await expect(brandSection).toBeVisible();
    });

    test('should display cars by budget section', async ({ page }) => {
        await page.waitForSelector('text=/Cars by Budget/i', { timeout: 10000 });

        const budgetSection = page.locator('text=/Cars by Budget/i').locator('..');
        await expect(budgetSection).toBeVisible();
    });

    test('should have working footer links', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();

        // Scroll to footer
        await footer.scrollIntoViewIfNeeded();

        // Check for social media links or contact info
        const footerLinks = footer.locator('a');
        await expect(footerLinks.first()).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Check that page is still functional
        await expect(page).toHaveTitle(/gadizone/);

        // Check mobile navigation
        const header = page.locator('header');
        await expect(header).toBeVisible();
    });

    test('should allow scrolling through page sections', async ({ page }) => {
        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait a bit for any lazy-loaded content
        await page.waitForTimeout(1000);

        // Check that footer is visible
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should load without console errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Allow some errors from external resources, but not from our code
        const criticalErrors = errors.filter(err =>
            !err.includes('favicon') &&
            !err.includes('analytics') &&
            !err.includes('third-party')
        );

        expect(criticalErrors.length).toBe(0);
    });
});
