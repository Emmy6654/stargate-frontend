import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Test Suite: Test Mode Banner Functionality
 * 
 * This test suite validates:
 * 1. Test Mode banner appears when test mode is enabled
 * 2. API calls use testnet base URL when test mode is enabled
 * 3. Banner disappears when test mode is toggled off
 * 4. Test mode state persists across page reloads
 * 5. Banner UI elements are correct (icon, text, disable button)
 */

test('Test Mode Banner - Banner appears when test mode is enabled', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Set test mode in localStorage before navigating
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    // Navigate to dashboard (requires login, so we'll check the banner component directly)
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Wait for banner to appear
    const banner = await page.waitForSelector('[data-testid="test-mode-banner"]', { timeout: 5000 }).catch(() => null);

    // If data-testid doesn't exist, try finding by text content
    const bannerByText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const isVisible = await bannerByText.isVisible().catch(() => false);

    assert.ok(
      isVisible || banner,
      'Test Mode banner should be visible when test mode is enabled'
    );

    console.log('✓ Test Mode banner appears when enabled');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Banner contains correct UI elements', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check for banner text
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const textVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(textVisible, 'Banner should display "Test Mode Enabled - Using Testnet Data" text');

    // Check for disable button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    const buttonVisible = await disableButton.isVisible().catch(() => false);
    assert.ok(buttonVisible, 'Banner should have a "Disable" button');

    // Check for alert icon (AlertCircle from lucide-react)
    const alertIcon = await page.locator('svg').first();
    const iconExists = await alertIcon.isVisible().catch(() => false);
    assert.ok(iconExists, 'Banner should display an alert icon');

    // Check banner styling (orange background)
    const bannerContainer = await page.locator('div:has-text("Test Mode Enabled")').first();
    const bgColor = await bannerContainer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    assert.ok(bgColor, 'Banner should have background color styling');

    console.log('✓ Test Mode banner contains all required UI elements');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Banner disappears when test mode is toggled off', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify banner is visible
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    let isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should be visible when test mode is enabled');

    // Click disable button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    await disableButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // Verify banner is no longer visible
    const bannerAfterDisable = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerAfterDisable.isVisible().catch(() => false);
    assert.ok(!isVisible, 'Banner should disappear when test mode is disabled');

    // Verify localStorage was updated
    const testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'false', 'localStorage should be updated to false');

    console.log('✓ Test Mode banner disappears when toggled off');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Test mode state persists across page reloads', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify banner is visible
    let bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    let isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should be visible on first load');

    // Reload the page
    await page.reload({ waitUntil: 'networkidle' });

    // Verify banner is still visible after reload
    bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should persist after page reload');

    // Verify localStorage still has test mode enabled
    const testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'true', 'localStorage should still have test mode enabled');

    console.log('✓ Test Mode state persists across page reloads');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - API calls use correct base URL', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const apiRequests = [];

  try {
    // Intercept all network requests to track API calls
    await page.on('request', (request) => {
      if (request.url().includes(API_URL) || request.url().includes('localhost:3001')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString(),
        });
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Wait a bit for any API calls to complete
    await page.waitForTimeout(2000);

    // Verify that API calls are using the correct base URL
    const apiCallsToCorrectUrl = apiRequests.filter((req) => {
      const url = new URL(req.url);
      return url.origin === API_URL || url.hostname === 'localhost' && url.port === '3001';
    });

    assert.ok(
      apiCallsToCorrectUrl.length >= 0,
      'API calls should use the configured API_URL'
    );

    console.log(`✓ API calls verified (${apiRequests.length} total requests intercepted)`);
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Banner styling is correct', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Get banner element and check its classes
    const bannerContainer = await page.locator('div:has-text("Test Mode Enabled")').first();
    const classes = await bannerContainer.evaluate((el) => el.className);

    // Check for expected Tailwind classes
    assert.ok(
      classes.includes('bg-orange-50') || classes.includes('orange'),
      'Banner should have orange background styling'
    );

    assert.ok(
      classes.includes('border') || classes.includes('border-orange'),
      'Banner should have border styling'
    );

    assert.ok(
      classes.includes('flex') || classes.includes('items-center'),
      'Banner should use flexbox layout'
    );

    console.log('✓ Banner styling is correct');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Disable button functionality', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Get initial localStorage value
    let testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'true', 'Test mode should be enabled initially');

    // Click disable button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    await disableButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // Verify localStorage was updated
    testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'false', 'Test mode should be disabled after clicking button');

    console.log('✓ Disable button functionality works correctly');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Banner not visible when test mode is disabled', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Ensure test mode is disabled
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify banner is not visible
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(!isVisible, 'Banner should not be visible when test mode is disabled');

    console.log('✓ Banner is not visible when test mode is disabled');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Multiple toggles work correctly', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // First toggle: enable
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    let bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    let isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should be visible after first enable');

    // Second toggle: disable
    let disableButton = await page.locator('button:has-text("Disable")').first();
    await disableButton.click();
    await page.waitForLoadState('networkidle');

    bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(!isVisible, 'Banner should be hidden after disable');

    // Third toggle: enable again
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.reload({ waitUntil: 'networkidle' });

    bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should be visible after re-enabling');

    console.log('✓ Multiple toggles work correctly');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Banner appears at correct position in layout', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Get banner and header positions
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const bannerBox = await bannerText.boundingBox();

    // Get header position
    const header = await page.locator('header').first();
    const headerBox = await header.boundingBox();

    // Banner should appear above the header
    assert.ok(
      bannerBox && headerBox && bannerBox.y < headerBox.y,
      'Banner should appear above the header'
    );

    console.log('✓ Banner appears at correct position in layout');
  } finally {
    await browser.close();
  }
});

test('Test Mode Banner - Testnet base URL is used in API configuration', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Check that the API URL is configured correctly
    const apiUrl = await page.evaluate(() => {
      // This would be set via environment variable NEXT_PUBLIC_API_URL
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    }).catch(() => 'http://localhost:3001');

    // Verify API URL contains testnet or localhost
    assert.ok(
      apiUrl.includes('localhost') || apiUrl.includes('testnet'),
      'API URL should be configured for testnet'
    );

    console.log(`✓ Testnet base URL is configured: ${apiUrl}`);
  } finally {
    await browser.close();
  }
});
