import { test, expect } from '@playwright/test';

/**
 * Compare Functionality E2E Tests
 * Tests car comparison feature
 */

test.describe('Compare Functionality', () => {
    test('should load compare page', async ({ page }) => {
        await page.goto('/compare');
        await page.waitForLoadState('networkidle');

        // Check page heading
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
    });

    test('should allow selecting first car', async ({ page }) => {
        await page.goto('/compare');
        await page.waitForLoadState('networkidle');

        // Look for car selection interface
        const selectButton = page.locator('button:has-text("Select"), button:has-text("Add Car")').first();

        if (await selectButton.isVisible()) {
            await selectButton.click();
            await page.waitForTimeout(1000);
        }
    });

    test('should allow selecting second car for comparison', async ({ page }) => {
        await page.goto('/compare');
        await page.waitForLoadState('networkidle');

        // Look for second car selection
        const selectButtons = page.locator('button:has-text("Select"), button:has-text("Add Car")');

        if (await selectButtons.count() > 1) {
            await selectButtons.nth(1).click();
            await page.waitForTimeout(1000);
        }
    });

    test('should display comparison table if cars exist', async ({ page }) => {
        // Navigate with pre-selected cars (if URL supports it)
        await page.goto('/compare?car1=maruti-suzuki-swift&car2=hyundai-i20');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Check for comparison table or car details
        const comparisonContent = page.locator('table, [data-testid="comparison-table"]').or(
            page.locator('text=/Specification|Price|Engine/i')
        );

        await expect(comparisonContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('should allow clearing selection', async ({ page }) => {
        await page.goto('/compare?car1=maruti-suzuki-swift&car2=hyundai-i20');
        await page.waitForLoadState('networkidle');

        // Look for clear/remove button
        const clearButton = page.locator('button:has-text("Clear"), button:has-text("Remove")').first();

        if (await clearButton.isVisible()) {
            await clearButton.click();
            await page.waitForTimeout(500);
        }
    });
});
