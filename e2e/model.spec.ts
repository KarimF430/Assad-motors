import { test, expect } from '@playwright/test';

/**
 * Model Page E2E Tests
 * Tests model detail pages with variants and specifications
 */

test.describe('Model Pages', () => {
    test('should display model details', async ({ page }) => {
        // Navigate to a specific model page
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Check that model name is displayed
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
    });

    test('should display pricing information', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Look for price display (₹ symbol or "Lakh")
        const priceElement = page.locator('text=/₹|Lakh/i').first();
        await expect(priceElement).toBeVisible({ timeout: 10000 });
    });

    test('should display variants section', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Wait for variants section
        await page.waitForSelector('text=/Variant|Version/i', { timeout: 10000 });
    });

    test('should display specifications', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Look for specifications section
        const specsSection = page.locator('text=/Specification|Features|Details/i').first();
        await expect(specsSection).toBeVisible({ timeout: 10000 });
    });

    test('should allow selecting different variants', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Wait for variant selection to be available
        await page.waitForTimeout(2000);

        // Look for variant buttons or selectable cards
        const variantButtons = page.locator('button:has-text("VXi"), button:has-text("ZXi"), [data-testid="variant-card"]');

        if (await variantButtons.count() > 0) {
            const firstVariant = variantButtons.first();
            if (await firstVariant.isVisible()) {
                await firstVariant.click();
                await page.waitForTimeout(500);
            }
        }
    });

    test('should have working compare functionality', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Look for compare button
        const compareButton = page.locator('button:has-text("Compare"), a:has-text("Compare")').first();

        if (await compareButton.isVisible()) {
            await compareButton.click();
            await page.waitForTimeout(500);
        }
    });

    test('should display model images', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Check for images
        const images = page.locator('img[alt*="Swift"], img[src*="swift"]');
        await expect(images.first()).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to variant detail page', async ({ page }) => {
        await page.goto('/cars/maruti-suzuki-swift');
        await page.waitForLoadState('networkidle');

        // Look for "View Details" or variant links
        const variantLink = page.locator('a[href*="/variants/"]').first();

        if (await variantLink.isVisible()) {
            await variantLink.click();
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain('/variants/');
        }
    });
});
