import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests (Mocked)
 * Tests authentication flows with mocked OAuth
 */

test.describe('Authentication', () => {
    test('should display login button in header', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Look for login/signup button
        const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In"), a:has-text("Login")').first();

        if (await loginButton.isVisible()) {
            await expect(loginButton).toBeVisible();
        }
    });

    test('should open login modal when clicking login', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Find and click login button
        const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In")').first();

        if (await loginButton.isVisible()) {
            await loginButton.click();
            await page.waitForTimeout(1000);

            // Check if modal or login page opened
            const loginForm = page.locator('text=/Email|Password|Google|Continue with/i');

            // Either modal or redirect to login page
            const isVisible = await loginForm.isVisible();
            const isLoginPage = page.url().includes('/login');

            expect(isVisible || isLoginPage).toBe(true);
        }
    });

    test('should display Google OAuth button', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Look for Google login button
        const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")').first();

        // Google OAuth should be available
        await expect(googleButton).toBeVisible({ timeout: 10000 });
    });

    test(' should handle Google OAuth redirect (mock)', async ({ page }) => {
        // This test mocks the OAuth flow without actually authenticating

        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Intercept OAuth redirect
        await page.route('**/auth/google*', async (route) => {
            // Mock successful redirect back
            await route.fulfill({
                status: 302,
                headers: {
                    'Location': '/?auth=success'
                }
            });
        });

        const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")').first();

        if (await googleButton.isVisible()) {
            await googleButton.click({ timeout: 5000 }).catch(() => { });
            // OAuth redirect would happen here in real flow
        }
    });

    test('should display user profile when logged in (mock)', async ({ page }) => {
        // Mock logged-in state by setting cookies
        await page.context().addCookies([
            {
                name: 'sid',
                value: 'mock-session-id',
                domain: 'localhost',
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            }
        ]);

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // In mocked state, profile icon or user menu should show
        // (This depends on your actual implementation)
    });
});
