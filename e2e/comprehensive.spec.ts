import { test, expect } from '@playwright/test';

/**
 * Comprehensive E2E Test Suite
 * Tests navigation and basic rendering of all 20+ major pages
 */

const PAGES = [
    { path: '/', name: 'Home' },
    { path: '/new-cars', name: 'New Cars' },
    { path: '/upcoming-cars-in-india', name: 'Upcoming Cars' },
    { path: '/popular-cars-in-india', name: 'Popular Cars' },
    { path: '/electric-cars', name: 'Electric Cars' },
    { path: '/top-selling-cars-in-india', name: 'Top Selling Cars' },
    { path: '/new-car-launches-in-india', name: 'New Launches' },
    { path: '/best-cars-under-10-lakh', name: 'Cars Under 10 Lakh' },
    { path: '/best-cars-under-15-lakh', name: 'Cars Under 15 Lakh' },
    { path: '/best-cars-under-25-lakh', name: 'Cars Under 25 Lakh' },
    { path: '/best-cars-under-50-lakh', name: 'Cars Under 50 Lakh' },
    { path: '/best-cars-under-8-lakh', name: 'Cars Under 8 Lakh' },
    { path: '/compare', name: 'Compare Cars' },
    { path: '/emi-calculator', name: 'EMI Calculator' },
    { path: '/news', name: 'News' },
    { path: '/price-breakup', name: 'Price Breakup' },
    { path: '/search', name: 'Search' },
    { path: '/privacy-policy', name: 'Privacy Policy' },
    { path: '/terms-and-conditions', name: 'Terms of Service' },
    { path: '/visitor-agreement', name: 'Visitor Agreement' },
    { path: '/login', name: 'Login' },
    { path: '/signup', name: 'Signup' },
    { path: '/forgot-password', name: 'Forgot Password' },
    { path: '/ai-chat', name: 'AI Chat' },
    // Dynamic routes (Mocked data ensures these work)
    { path: '/brands/maruti-suzuki', name: 'Brand Page (Maruti)' },
    { path: '/maruti-suzuki-cars', name: 'Brand Cars List (Maruti)' }, // Mapped to [brand-cars]
];

const MOCK_BRAND_DATA = [
    {
        id: '1',
        name: 'Maruti Suzuki',
        logo: '/brands/maruti.png',
        slug: 'maruti-suzuki',
        description: 'Test Description'
    }
];

const MOCK_CAR_DATA = {
    data: [
        {
            id: '101',
            name: 'Swift',
            brandId: '1',
            brandName: 'Maruti Suzuki',
            price: 600000,
            lowestPrice: 600000,
            heroImage: '/swift.jpg',
            slug: 'maruti-suzuki-swift'
        }
    ],
    pagination: {}
};

test.describe('Comprehensive Site Verification', () => {

    test.beforeEach(async ({ page }) => {
        // Mock API calls to ensure pages don't fail due to backend/database issues
        await page.route('**/api/brands', async route => {
            await route.fulfill({ json: MOCK_BRAND_DATA });
        });
        await page.route('**/api/brands/*', async route => route.fulfill({ json: MOCK_BRAND_DATA[0] }));

        // Mock car lists
        await page.route('**/api/cars*', async route => route.fulfill({ json: MOCK_CAR_DATA }));
        await page.route('**/api/models-with-pricing*', async route => route.fulfill({ json: MOCK_CAR_DATA }));
        await page.route('**/api/upcoming-cars', async route => route.fulfill({ json: MOCK_CAR_DATA.data }));
        await page.route('**/api/news*', async route => route.fulfill({ json: { articles: [] } }));
    });

    for (const pageInfo of PAGES) {
        test(`should load ${pageInfo.name} at ${pageInfo.path}`, async ({ page }) => {
            console.log(`Testing navigation to: ${pageInfo.path}`);

            if (pageInfo.path === '/') {
                await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded', timeout: 60000 });
            } else {
                await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded' });
            }

            // Special handling for homepage which might have complex lazy loading or ads
            if (pageInfo.path === '/') {
                expect(page.url()).toBe('http://localhost:3000/');
                await expect(page.locator('body')).toBeVisible();
                return;
            }

            // Basic sanity check - page should have a body and not be a 404
            // Checking for common elements like header or main
            // We verify the URL matches (handling potential trailing slashes or redirects)
            const currentUrl = page.url();
            expect(currentUrl).toContain(pageInfo.path.split('?')[0]);

            // Verify no "404" or "Not Found" text prominently displayed as H1
            const h1 = page.locator('h1');
            if (await h1.count() > 0) {
                const h1Text = await h1.innerText();
                expect(h1Text).not.toContain('404');
                expect(h1Text).not.toContain('Page Not Found');
            }

            // Allow some time for hydration/rendering
            await page.waitForTimeout(500);

            // Take a screenshot of the viewport (optional for debug, helpful for artifacts)
            // await page.screenshot({ path: `e2e-screenshots/${pageInfo.name.replace(/\s+/g, '-')}.png` });
        });
    }
});
