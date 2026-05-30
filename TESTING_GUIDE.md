# Test Mode Banner & Toggle - Testing Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm dependencies installed: `npm install`
- Application running or accessible at `http://localhost:3000`
- Backend API running at `http://localhost:3001` (or configured via `NEXT_PUBLIC_API_URL`)

### Run All Tests
```bash
npm test
```

### Run Test Mode Tests Only
```bash
npm test -- tests/test-mode*.test.mjs
```

### Run Specific Test File
```bash
npm test -- tests/test-mode-banner.test.mjs
npm test -- tests/test-mode-integration.test.mjs
npm test -- tests/test-mode-components.test.mjs
```

## Test Suite Overview

### 1. Test Mode Banner Tests (`test-mode-banner.test.mjs`)
**Purpose**: Validate Test Mode Banner component behavior and API configuration

**Key Assertions**:
- ✅ Banner appears when test mode is enabled
- ✅ Banner contains correct UI elements (text, button, icon)
- ✅ Banner disappears when test mode is toggled off
- ✅ Test mode state persists across page reloads
- ✅ API calls use correct base URL
- ✅ Banner styling is correct
- ✅ Disable button functionality works
- ✅ Banner not visible when test mode is disabled
- ✅ Multiple toggles work correctly
- ✅ Banner appears at correct position in layout

**Run**: `npm test -- tests/test-mode-banner.test.mjs`

### 2. Integration Tests (`test-mode-integration.test.mjs`)
**Purpose**: Validate integration between TestModeBanner and TestModeToggle components

**Key Assertions**:
- ✅ TestModeToggle button enables test mode
- ✅ TestModeToggle button disables test mode
- ✅ Banner disable button and toggle button are synchronized
- ✅ Test mode state survives multiple page navigations
- ✅ localStorage is properly synchronized between components
- ✅ API calls respect test mode configuration
- ✅ Test mode banner is accessible
- ✅ Test mode toggle button styling changes based on state
- ✅ Test mode banner and toggle work in header layout
- ✅ Test mode persists through browser session

**Run**: `npm test -- tests/test-mode-integration.test.mjs`

### 3. Component Unit Tests (`test-mode-components.test.mjs`)
**Purpose**: Validate individual component behavior

**TestModeBanner Tests**:
- ✅ Renders when test mode is enabled
- ✅ Does not render when test mode is disabled
- ✅ Displays correct text content
- ✅ Has disable button
- ✅ Disable button triggers toggle
- ✅ Uses correct styling classes
- ✅ Disable button is keyboard accessible
- ✅ Reads from localStorage on mount

**TestModeToggle Tests**:
- ✅ Renders with correct initial state
- ✅ Shows correct text based on state
- ✅ Button click triggers page reload
- ✅ Updates localStorage on click
- ✅ Has correct styling
- ✅ Is keyboard accessible
- ✅ Reads from localStorage on mount

**Run**: `npm test -- tests/test-mode-components.test.mjs`

## Test Execution Flow

### Typical Test Flow
1. Launch Chromium browser in headless mode
2. Navigate to application base URL
3. Set localStorage `stargate_test_mode` value
4. Navigate to dashboard or reload page
5. Verify component behavior and state
6. Close browser

### Example: Banner Visibility Test
```
1. Launch browser
2. Navigate to http://localhost:3000
3. Set localStorage: stargate_test_mode = 'true'
4. Navigate to http://localhost:3000/dashboard
5. Wait for banner element
6. Assert banner is visible
7. Assert banner contains correct text
8. Close browser
```

## Environment Configuration

### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Test Environment Variables
```bash
# Optional - override defaults
BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### Test Fails: "Banner not found"
**Cause**: Banner element not rendered or not visible
**Solution**:
1. Verify test mode is enabled: `localStorage.getItem('stargate_test_mode') === 'true'`
2. Check dashboard page loads: Navigate to `http://localhost:3000/dashboard`
3. Verify component is in layout: Check `app/dashboard/layout.tsx`
4. Check browser console for errors

### Test Fails: "Page reload timeout"
**Cause**: Page doesn't reload after button click
**Solution**:
1. Verify button click works: Check element is clickable
2. Increase timeout: `await page.waitForLoadState('networkidle', { timeout: 10000 })`
3. Check for JavaScript errors in console
4. Verify `window.location.reload()` is called in component

### Test Fails: "localStorage not updated"
**Cause**: localStorage value doesn't persist
**Solution**:
1. Verify localStorage is enabled in browser
2. Check for private/incognito mode
3. Verify localStorage key: `stargate_test_mode` (exact spelling)
4. Check for localStorage clearing in component

### Test Fails: "API calls not intercepted"
**Cause**: Network requests not captured
**Solution**:
1. Verify API_URL is correct: `http://localhost:3001`
2. Check backend is running
3. Verify dashboard makes API calls
4. Check network tab in browser DevTools

## Test Results Interpretation

### Passing Test Output
```
✓ Test Mode Banner - Banner appears when test mode is enabled
```

### Failing Test Output
```
✗ Test Mode Banner - Banner appears when test mode is enabled
  AssertionError: Test Mode banner should be visible when test mode is enabled
```

### Test Summary
```
34 tests passed
0 tests failed
Total time: 2m 45s
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Tests per file | 10-14 |
| Total tests | 34 |
| Avg time per test | 5-10 seconds |
| Total suite time | 2-3 minutes |
| Browser launches | 34 |

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Mode Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run dev &
      - run: npm test -- tests/test-mode*.test.mjs
```

## Manual Testing Checklist

Use this checklist for manual testing:

- [ ] Enable test mode via toggle button
- [ ] Verify banner appears with correct text
- [ ] Verify banner has orange background
- [ ] Verify banner has alert icon
- [ ] Verify banner has disable button
- [ ] Click disable button
- [ ] Verify page reloads
- [ ] Verify banner disappears
- [ ] Verify toggle button text changes to "Enable Test Mode"
- [ ] Verify localStorage is updated
- [ ] Reload page
- [ ] Verify banner is still gone
- [ ] Enable test mode again
- [ ] Verify banner reappears
- [ ] Check API calls in network tab
- [ ] Verify API URL is correct

## Advanced Testing

### Run with Verbose Output
```bash
npm test -- tests/test-mode*.test.mjs --verbose
```

### Run Single Test
```bash
npm test -- tests/test-mode-banner.test.mjs --grep "Banner appears"
```

### Debug Mode
```bash
# Run with debugging enabled
DEBUG=* npm test -- tests/test-mode-banner.test.mjs
```

### Headless Mode Disabled (See Browser)
Edit test file and change:
```javascript
const browser = await chromium.launch({ headless: true });
```
to:
```javascript
const browser = await chromium.launch({ headless: false });
```

## Test Data

### localStorage Keys
- `stargate_test_mode`: Boolean string ('true' or 'false')

### Expected Values
- Enabled: `localStorage.getItem('stargate_test_mode') === 'true'`
- Disabled: `localStorage.getItem('stargate_test_mode') === 'false'`

### Banner Text
- "Test Mode Enabled - Using Testnet Data"

### Button Text
- Enable: "Enable Test Mode"
- Disable: "Disable"
- Exit: "Exit Test Mode"

## Common Test Patterns

### Check Element Visibility
```javascript
const element = await page.locator('text=Banner Text').first();
const isVisible = await element.isVisible().catch(() => false);
assert.ok(isVisible, 'Element should be visible');
```

### Update localStorage
```javascript
await page.evaluate(() => {
  localStorage.setItem('stargate_test_mode', 'true');
});
```

### Click Button and Wait for Reload
```javascript
const button = await page.locator('button:has-text("Disable")').first();
await button.click();
await page.waitForLoadState('networkidle');
```

### Verify localStorage Value
```javascript
const value = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
assert.equal(value, 'true', 'Test mode should be enabled');
```

## Documentation

- **Full Test Documentation**: See `tests/TEST_MODE_TESTS_README.md`
- **Component Implementation**: See `components/dashboard/TestModeBanner.tsx`
- **Component Implementation**: See `components/dashboard/TestModeToggle.tsx`
- **API Configuration**: See `lib/api.ts`
- **Dashboard Layout**: See `app/dashboard/layout.tsx`

## Support

For issues or questions:
1. Check test output for specific error messages
2. Review troubleshooting section above
3. Check component implementation files
4. Review test code comments
5. Check browser console for errors

## Next Steps

After tests pass:
1. Review test coverage report
2. Check for edge cases not covered
3. Add additional tests as needed
4. Update documentation
5. Commit tests to repository
6. Set up CI/CD pipeline
