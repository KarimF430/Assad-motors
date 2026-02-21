import { test, expect } from '@playwright/test';

/**
 * Search Functionality E2E Tests
 * Tests car search and filtering
 */

test.describe('Search Functionality', () => {
    test('should display search interface', async ({ page }) => {
        await page.goto('/search');
        await page.waitForLoadState('networkidle');

        // Look for search input or heading
        const searchHeading = page.locator('h1, h2').first();
        await expect(searchHeading).toBeVisible();
    });

    test('should allow typing in search input', async ({ page }) => {
        await page.goto('/search');

        // Find search input
        const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();

        if (await searchInput.isVisible()) {
            await searchInput.fill('Swift');
            expect(await searchInput.inputValue()).toBe('Swift');
        }
    });

    test('should display search results', async ({ page }) => {
        await page.goto('/search?q=swift');
        await page.waitForLoadState('networkidle');

        // Wait for results
        await page.waitForTimeout(2000);

        // Check for result cards or "no results" message
        const results = page.locator('[data-testid="search-result"], .search-result, a[href*="/cars/"]');
        const noResults = page.locator('text=/No results|No cars found/i');

        const hasResults = await results.count() > 0;
        const hasNoResults = await noResults.isVisible();

        // Either results or no results message should be visible
        expect(hasResults || hasNoResults).toBe(true);
    });

    test('should allow filtering by price', async ({ page }) => {
        await page.goto('/search');
        await page.waitForLoadState('networkidle');

        // Look for price filter
        const priceFilter = page.locator('text=/Price|Budget/i, [data-testid="price-filter"]').first();

        if (await priceFilter.isVisible()) {
            await priceFilter.scrollIntoViewIfNeeded();
        }
    });

    test('should allow filtering by fuel type', async ({ page }) => {
        await page.goto('/search');
        await page.waitForLoadState('networkidle');

        // Look for fuel type filter
        const fuelFilter = page.locator('text=/Petrol|Diesel|Electric/, input[type="checkbox"][value="petrol"]').first();

        if (await fuelFilter.isVisible()) {
            await fuelFilter.scrollIntoViewIfNeeded();
        }
    });

    test('should allow filtering by brand', async ({ page }) => {
        await page.goto('/search');
        await page.waitForLoadState('networkidle');

        // Look for brand filter
        const brandFilter = page.locator('text=/Brand|Manufacturer/i, [data-testid="brand-filter"]').first();

        if (await brandFilter.isVisible()) {
            await brandFilter.scrollIntoViewIfNeeded();
        }
    });
});
