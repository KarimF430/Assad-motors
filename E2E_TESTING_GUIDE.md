# E2E Testing Guide - Playwright

## Overview

This project uses **Playwright** for end-to-end (E2E) testing to ensure critical user flows work correctly across multiple browsers.

## Quick Start

### 1. Install Dependencies

```bash
# Install Playwright (already done)
npm install -D @playwright/test

# Install browser binaries
npx playwright install
```

### 2. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run in debug mode
npm run test:e2e:debug
```

## Test Structure

```
e2e/
├── home.spec.ts          - Home page tests
├── brand.spec.ts         - Brand listing and pages
├── model.spec.ts         - Model detail pages
├── search.spec.ts        - Search functionality
├── compare.spec.ts       - Car comparison
├── auth.spec.ts          - Authentication flows (mocked)
└── fixtures/
    └── mockData.ts       - Test data fixtures
```

## Test Coverage

### Home Page (`home.spec.ts`)
- ✅ Page loads with correct title
- ✅ Header navigation is visible
- ✅ Hero section displays
- ✅ Popular cars section renders
- ✅ Brand section shows brands
- ✅ Budget section is visible
- ✅ Footer links work
- ✅ Mobile responsiveness
- ✅ No console errors

### Brand Pages (`brand.spec.ts`)
- ✅ Brand listing page displays
- ✅ Brand page loads with logo
- ✅ Models are displayed
- ✅ Model cards are clickable
- ✅ Meta tags are correct

### Model Pages (`model.spec.ts`)
- ✅ Model details display
- ✅ Pricing information shown
- ✅ Variants section visible
- ✅ Specifications displayed
- ✅ Variant selection works
- ✅ Compare functionality exists
- ✅ Model images load
- ✅ Navigation to variant pages

### Search (`search.spec.ts`)
- ✅ Search interface loads
- ✅ Search input accepts text
- ✅ Results display
- ✅ Price filter available
- ✅ Fuel type filter available
- ✅ Brand filter available

### Compare (`compare.spec.ts`)
- ✅ Compare page loads
- ✅ Car selection works
- ✅ Comparison table displays
- ✅ Clear selection works

### Authentication (`auth.spec.ts`)
- ✅ Login button visible
- ✅ Login modal opens
- ✅ Google OAuth button exists
- ✅ OAuth redirect (mocked)

## Configuration

**File:** `playwright.config.ts`

### Browsers
Tests run on:
- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Settings
- **Timeout:** 30s per test
- **Retries:** 2 on CI, 0 locally
- **Parallel:** Fully parallel execution
- **Base URL:** `http://localhost:3000`
- **Screenshots:** On failure only
- **Video:** Retained on failure

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('selector');
    
    // Act
    await element.click();
    
    // Assert
    await expect(element).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** in components:
   ```tsx
   <div data-testid="brand-card">...</div>
   ```

2. **Wait for network idle** after navigation:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Use robust selectors**:
   ```typescript
   // Good ✅
   page.getByRole('button', { name: 'Login' })
   page.locator('[data-testid="brand-card"]')
   
   // Avoid ❌
   page.locator('.some-class')
   ```

4. **Handle async operations**:
   ```typescript
   await page.waitForSelector('text=/Loading/i', { state: 'hidden' });
   ```

## Debugging

### UI Mode (Recommended)
```bash
npm run test:e2e:ui
```
- Time travel debugging
- Watch mode
- Pick locators visually

### Debug Mode
```bash
npm run test:e2e:debug
```
- Pause execution
- Step through tests
- Inspector opens automatically

### Screenshots & Videos
Failed tests automatically capture:
- Screenshot: `playwright-report/`
- Video: `playwright-report/`
- Trace: `playwright-report/`

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Common Issues

### Issue: "Executable doesn't exist"
**Solution:** Run `npx playwright install`

### Issue: "Cannot find module"
**Solution:** Run `npm install`

### Issue: "Timeout waiting for element"
**Solutions:**
- Increase timeout: `{ timeout: 10000 }`
- Wait for network: `await page.waitForLoadState('networkidle')`
- Check element actually exists in UI

### Issue: "Browser not launching"
**Solution:** Install system dependencies:
```bash
npx playwright install-deps
```

## Performance Tips

1. **Run in parallel** (default):
   - Tests run concurrently
   - Faster execution

2. **Use `test.beforeEach`** for setup:
   - Reduces code duplication
   - Cleaner test files

3. **Mock API calls** when possible:
   ```typescript
   await page.route('**/api/models', route => {
     route.fulfill({ json: mockData });
   });
   ```

## Reports

### HTML Report
After running tests:
```bash
npx playwright show-report
```

Opens interactive HTML report with:
- Test results
- Screenshots
- Videos
- Traces
- Logs

### JSON Report
Location: `playwright-report/test-results.json`

Can be used for:
- CI/CD dashboards
- Custom reporting
- Metrics tracking

## Next Steps

1. Add more test coverage:
   - EMI calculator
   - Price breakup pages
   - News articles
   - Admin dashboard (with auth)

2. Add visual regression testing:
   ```bash
   npm install -D @playwright/test playwright-expect
   ```

3. Integrate with Lighthouse for performance testing

4. Add accessibility testing with axe-core

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generator](https://playwright.dev/docs/codegen)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)

---

**Happy Testing! 🎭**
