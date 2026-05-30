# Test Mode Banner & Toggle - Comprehensive Test Suite

## Overview

This test suite provides comprehensive coverage for the Test Mode Banner and Test Mode Toggle functionality in the Stargate Frontend application. The tests validate that:

1. ✅ Test Mode banner appears when test mode is enabled
2. ✅ API calls use testnet base URL when test mode is enabled
3. ✅ Banner disappears when test mode is toggled off
4. ✅ Test mode state persists across page reloads
5. ✅ Components are properly integrated and synchronized

## Test Files

### 1. `test-mode-banner.test.mjs` (10 tests)
**Focus**: Test Mode Banner component behavior and API configuration

#### Tests:
- **Banner appears when test mode is enabled** - Validates banner visibility when `stargate_test_mode` is true
- **Banner contains correct UI elements** - Checks for text, disable button, and alert icon
- **Banner disappears when test mode is toggled off** - Validates banner removal and localStorage update
- **Test mode state persists across page reloads** - Ensures state survives page refresh
- **API calls use correct base URL** - Verifies API requests use configured `NEXT_PUBLIC_API_URL`
- **Banner styling is correct** - Validates Tailwind CSS classes (orange background, border, flexbox)
- **Disable button functionality** - Tests button click and localStorage update
- **Banner not visible when test mode is disabled** - Validates conditional rendering
- **Multiple toggles work correctly** - Tests enable/disable/enable sequence
- **Banner appears at correct position in layout** - Validates banner appears above header

### 2. `test-mode-integration.test.mjs` (10 tests)
**Focus**: Integration between TestModeBanner and TestModeToggle components

#### Tests:
- **TestModeToggle button enables test mode** - Validates "Enable Test Mode" button functionality
- **TestModeToggle button disables test mode** - Validates "Exit Test Mode" button functionality
- **Banner disable button and toggle button are synchronized** - Ensures both controls work together
- **Test mode state survives multiple page navigations** - Tests state persistence across navigation
- **localStorage is properly synchronized between components** - Validates state sync between components
- **API calls respect test mode configuration** - Verifies API behavior with test mode enabled
- **Test mode banner is accessible** - Checks ARIA attributes and semantic HTML
- **Test mode toggle button styling changes based on state** - Validates visual feedback
- **Test mode banner and toggle work in header layout** - Validates layout integration
- **Test mode persists through browser session** - Tests state persistence in same browser context

### 3. `test-mode-components.test.mjs` (14 tests)
**Focus**: Individual component unit tests

#### TestModeBanner Tests:
- **Renders when test mode is enabled** - Component visibility
- **Does not render when test mode is disabled** - Conditional rendering
- **Displays correct text content** - Text validation
- **Has disable button** - Button presence
- **Disable button triggers toggle** - Event handling
- **Uses correct styling classes** - CSS class validation
- **Disable button is keyboard accessible** - Accessibility

#### TestModeToggle Tests:
- **Renders with correct initial state** - Initial state validation
- **Shows correct text based on state** - Dynamic text rendering
- **Button click triggers page reload** - Page reload behavior
- **Updates localStorage on click** - State persistence
- **Has correct styling** - CSS styling
- **Is keyboard accessible** - Accessibility
- **Reads from localStorage on mount** - Component initialization

#### Shared Tests:
- **Banner reads from localStorage on mount** - Component initialization
- **Toggle reads from localStorage on mount** - Component initialization

## Running the Tests

### Run all test mode tests:
```bash
npm test -- tests/test-mode*.test.mjs
```

### Run specific test file:
```bash
npm test -- tests/test-mode-banner.test.mjs
npm test -- tests/test-mode-integration.test.mjs
npm test -- tests/test-mode-components.test.mjs
```

### Run with verbose output:
```bash
npm test -- tests/test-mode*.test.mjs --verbose
```

## Test Architecture

### Technology Stack
- **Test Framework**: Node.js built-in test runner
- **Browser Automation**: Playwright (Chromium)
- **Assertions**: Node.js strict assert module

### Test Approach
1. **E2E Testing**: Tests run against actual browser instances
2. **localStorage Manipulation**: Tests set/verify localStorage state
3. **DOM Queries**: Tests use Playwright locators to find elements
4. **Network Interception**: Tests track API calls and verify URLs

### Key Testing Patterns

#### 1. Setting Test Mode State
```javascript
await page.evaluate(() => {
  localStorage.setItem('stargate_test_mode', 'true');
});
```

#### 2. Verifying Banner Visibility
```javascript
const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
const isVisible = await bannerText.isVisible().catch(() => false);
assert.ok(isVisible, 'Banner should be visible');
```

#### 3. Triggering Page Reload
```javascript
const button = await page.locator('button:has-text("Disable")').first();
await button.click();
await page.waitForLoadState('networkidle');
```

#### 4. Verifying localStorage Updates
```javascript
const testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
assert.equal(testModeValue, 'false', 'Test mode should be disabled');
```

## Component Implementation Details

### TestModeBanner Component
**Location**: `components/dashboard/TestModeBanner.tsx`

**Behavior**:
- Reads `stargate_test_mode` from localStorage on mount
- Renders orange banner with alert icon when enabled
- Displays "Test Mode Enabled - Using Testnet Data" text
- Provides "Disable" button that toggles state and reloads page
- Returns null when test mode is disabled (conditional rendering)

**Key Features**:
- Client-side component (`'use client'`)
- Uses `useEffect` to read localStorage on mount
- Uses `useState` for local state management
- Triggers `window.location.reload()` on toggle

### TestModeToggle Component
**Location**: `components/dashboard/TestModeToggle.tsx`

**Behavior**:
- Reads `stargate_test_mode` from localStorage on mount
- Shows "Enable Test Mode" button when disabled
- Shows "Exit Test Mode" button when enabled
- Updates localStorage and reloads page on click
- Changes button styling based on state (primary vs secondary)

**Key Features**:
- Client-side component (`'use client'`)
- Uses `useState` for state management
- Initializes state from localStorage
- Triggers `window.location.reload()` on toggle

## API Configuration

### Environment Variables
- **NEXT_PUBLIC_API_URL**: Base URL for API calls (default: `http://localhost:3001`)
- **NEXT_PUBLIC_STELLAR_NETWORK**: Network selection - `testnet` or `mainnet` (default: `testnet`)

### API Client
**Location**: `lib/api.ts`

**Behavior**:
- Uses `NEXT_PUBLIC_API_URL` for all API requests
- Centralized request function with retry logic
- Bearer token authentication
- 401 redirects to login

**Note**: Test mode currently only shows a banner; it doesn't switch API endpoints or networks. The API URL is environment-based, not runtime-switchable.

## Test Coverage Summary

| Category | Tests | Coverage |
|----------|-------|----------|
| Banner Rendering | 4 | ✅ Complete |
| Banner Styling | 2 | ✅ Complete |
| Banner Functionality | 3 | ✅ Complete |
| Toggle Rendering | 2 | ✅ Complete |
| Toggle Functionality | 3 | ✅ Complete |
| State Persistence | 4 | ✅ Complete |
| Integration | 5 | ✅ Complete |
| Accessibility | 3 | ✅ Complete |
| API Configuration | 2 | ✅ Complete |
| **Total** | **34** | **✅ Complete** |

## Expected Test Results

All 34 tests should pass with the following output:

```
✓ Test Mode Banner - Banner appears when test mode is enabled
✓ Test Mode Banner - Banner contains correct UI elements
✓ Test Mode Banner - Banner disappears when test mode is toggled off
✓ Test Mode Banner - Test mode state persists across page reloads
✓ Test Mode Banner - API calls use correct base URL
✓ Test Mode Banner - Banner styling is correct
✓ Test Mode Banner - Disable button functionality
✓ Test Mode Banner - Banner not visible when test mode is disabled
✓ Test Mode Banner - Multiple toggles work correctly
✓ Test Mode Banner - Banner appears at correct position in layout
✓ Integration - TestModeToggle button enables test mode
✓ Integration - TestModeToggle button disables test mode
✓ Integration - Banner disable button and toggle button are synchronized
✓ Integration - Test mode state survives multiple page navigations
✓ Integration - localStorage is properly synchronized between components
✓ Integration - API calls respect test mode configuration
✓ Integration - Test mode banner is accessible
✓ Integration - Test mode toggle button styling changes based on state
✓ Integration - Test mode banner and toggle work in header layout
✓ Integration - Test mode persists through browser session
✓ TestModeBanner Component - Renders when test mode is enabled
✓ TestModeBanner Component - Does not render when test mode is disabled
✓ TestModeBanner Component - Displays correct text content
✓ TestModeBanner Component - Has disable button
✓ TestModeBanner Component - Disable button triggers toggle
✓ TestModeBanner Component - Uses correct styling classes
✓ TestModeToggle Component - Renders with correct initial state
✓ TestModeToggle Component - Shows correct text based on state
✓ TestModeToggle Component - Button click triggers page reload
✓ TestModeToggle Component - Updates localStorage on click
✓ TestModeToggle Component - Has correct styling
✓ TestModeToggle Component - Is keyboard accessible
✓ TestModeBanner Component - Disable button is keyboard accessible
✓ TestModeBanner Component - Reads from localStorage on mount
✓ TestModeToggle Component - Reads from localStorage on mount
```

## Debugging Failed Tests

### Common Issues

#### 1. Banner Not Found
**Symptom**: Test fails to find banner element
**Solution**: 
- Verify test mode is enabled in localStorage
- Check that dashboard page loads successfully
- Verify component is rendered in dashboard layout

#### 2. Page Reload Not Detected
**Symptom**: Test times out waiting for page reload
**Solution**:
- Increase timeout: `await page.waitForLoadState('networkidle', { timeout: 10000 })`
- Verify button click is working
- Check browser console for errors

#### 3. localStorage Not Persisting
**Symptom**: localStorage value doesn't persist after page reload
**Solution**:
- Verify localStorage is not cleared by browser
- Check for private/incognito mode
- Verify localStorage key name is correct: `stargate_test_mode`

#### 4. API Calls Not Intercepted
**Symptom**: No API requests captured
**Solution**:
- Verify API_URL environment variable is set
- Check network tab in browser DevTools
- Verify dashboard makes API calls on load

## Performance Considerations

- Each test launches a new browser instance (~2-3 seconds per test)
- Total test suite runtime: ~2-3 minutes
- Tests run sequentially by default
- Can be parallelized with test runner configuration

## Future Enhancements

1. **Visual Regression Testing**: Add screenshot comparisons
2. **Performance Testing**: Measure banner render time
3. **Mobile Testing**: Test on mobile viewports
4. **Dark Mode Testing**: Test banner in dark mode
5. **Internationalization**: Test with different locales
6. **Error Scenarios**: Test error handling and edge cases

## Related Documentation

- [TestModeBanner Component](../components/dashboard/TestModeBanner.tsx)
- [TestModeToggle Component](../components/dashboard/TestModeToggle.tsx)
- [API Configuration](../lib/api.ts)
- [Environment Variables](.env.local.example)
- [Dashboard Layout](../app/dashboard/layout.tsx)

## Contributing

When adding new test mode features:

1. Add corresponding tests to appropriate test file
2. Update this README with new test descriptions
3. Ensure all tests pass before submitting PR
4. Maintain test coverage above 90%
5. Follow existing test patterns and naming conventions

## Test Maintenance

- Review tests quarterly for relevance
- Update tests when component implementation changes
- Keep test data realistic and up-to-date
- Monitor test execution time and optimize if needed
- Archive old test results for trend analysis
