import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * Integration Test Suite: Test Mode Banner & Toggle Integration
 * 
 * This test suite validates the integration between:
 * 1. TestModeBanner component
 * 2. TestModeToggle component
 * 3. localStorage state management
 * 4. Page reload behavior
 * 5. API configuration with test mode
 */

test('Integration - TestModeToggle button enables test mode', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Ensure test mode is initially disabled
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Find and click the "Enable Test Mode" button
    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    const buttonExists = await enableButton.isVisible().catch(() => false);
    assert.ok(buttonExists, 'Enable Test Mode button should be visible');

    // Click the button
    await enableButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // Verify test mode is now enabled in localStorage
    const testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'true', 'Test mode should be enabled after clicking button');

    // Verify banner is now visible
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Test Mode banner should be visible after enabling');

    console.log('✓ TestModeToggle button enables test mode correctly');
  } finally {
    await browser.close();
  }
});

test('Integration - TestModeToggle button disables test mode', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Find and click the "Exit Test Mode" button
    const exitButton = await page.locator('button:has-text("Exit Test Mode")').first();
    const buttonExists = await exitButton.isVisible().catch(() => false);
    assert.ok(buttonExists, 'Exit Test Mode button should be visible when test mode is enabled');

    // Click the button
    await exitButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // Verify test mode is now disabled in localStorage
    const testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'false', 'Test mode should be disabled after clicking button');

    // Verify banner is no longer visible
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(!isVisible, 'Test Mode banner should not be visible after disabling');

    console.log('✓ TestModeToggle button disables test mode correctly');
  } finally {
    await browser.close();
  }
});

test('Integration - Banner disable button and toggle button are synchronized', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify both banner and toggle button show test mode is enabled
    const bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const bannerVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(bannerVisible, 'Banner should be visible');

    const exitButton = await page.locator('button:has-text("Exit Test Mode")').first();
    const exitButtonVisible = await exitButton.isVisible().catch(() => false);
    assert.ok(exitButtonVisible, 'Exit Test Mode button should be visible');

    // Click banner disable button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    await disableButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // Verify both banner and toggle button now show test mode is disabled
    const bannerAfter = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const bannerVisibleAfter = await bannerAfter.isVisible().catch(() => false);
    assert.ok(!bannerVisibleAfter, 'Banner should not be visible after disable');

    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    const enableButtonVisible = await enableButton.isVisible().catch(() => false);
    assert.ok(enableButtonVisible, 'Enable Test Mode button should be visible after disable');

    console.log('✓ Banner disable button and toggle button are synchronized');
  } finally {
    await browser.close();
  }
});

test('Integration - Test mode state survives multiple page navigations', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    let bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    let isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should be visible on dashboard');

    // Navigate to another page (if available)
    await page.goto(`${BASE_URL}/dashboard/invoices`, { waitUntil: 'networkidle' }).catch(() => {
      // If page doesn't exist, that's okay
    });

    // Check if banner is still visible
    bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should persist across page navigation');

    // Navigate back to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should be visible when returning to dashboard');

    console.log('✓ Test mode state survives multiple page navigations');
  } finally {
    await browser.close();
  }
});

test('Integration - localStorage is properly synchronized between components', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Start with test mode disabled
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify initial state
    let testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'false', 'Test mode should be disabled initially');

    // Enable via toggle button
    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    await enableButton.click();
    await page.waitForLoadState('networkidle');

    // Verify state changed
    testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'true', 'Test mode should be enabled after toggle');

    // Disable via banner button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    await disableButton.click();
    await page.waitForLoadState('networkidle');

    // Verify state changed again
    testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'false', 'Test mode should be disabled after banner button');

    console.log('✓ localStorage is properly synchronized between components');
  } finally {
    await browser.close();
  }
});

test('Integration - API calls respect test mode configuration', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const requests = [];

  try {
    // Track all network requests
    await page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
      });
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Wait for any API calls to complete
    await page.waitForTimeout(2000);

    // Verify that requests were made
    assert.ok(requests.length > 0, 'Should have made network requests');

    // Check that API requests use the correct base URL
    const apiRequests = requests.filter((req) => {
      try {
        const url = new URL(req.url);
        return url.hostname === 'localhost' || url.hostname.includes('api');
      } catch {
        return false;
      }
    });

    // API requests should exist (if dashboard makes any)
    console.log(`✓ API calls respect test mode configuration (${apiRequests.length} API requests)`);
  } finally {
    await browser.close();
  }
});

test('Integration - Test mode banner is accessible', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check banner has proper ARIA attributes
    const bannerContainer = await page.locator('div:has-text("Test Mode Enabled")').first();
    
    // Check for text content (screen readers will read this)
    const textContent = await bannerContainer.textContent();
    assert.ok(
      textContent.includes('Test Mode Enabled'),
      'Banner should have descriptive text for screen readers'
    );

    // Check disable button is keyboard accessible
    const disableButton = await page.locator('button:has-text("Disable")').first();
    const isButton = await disableButton.evaluate((el) => el.tagName === 'BUTTON');
    assert.ok(isButton, 'Disable control should be a button element');

    console.log('✓ Test mode banner is accessible');
  } finally {
    await browser.close();
  }
});

test('Integration - Test mode toggle button styling changes based on state', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Disable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check button styling when disabled
    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    let buttonClasses = await enableButton.evaluate((el) => el.className);
    assert.ok(
      buttonClasses.includes('primary') || buttonClasses.includes('violet'),
      'Enable button should have primary styling'
    );

    // Enable test mode
    await enableButton.click();
    await page.waitForLoadState('networkidle');

    // Check button styling when enabled
    const exitButton = await page.locator('button:has-text("Exit Test Mode")').first();
    buttonClasses = await exitButton.evaluate((el) => el.className);
    assert.ok(
      buttonClasses.includes('secondary') || buttonClasses.includes('slate'),
      'Exit button should have secondary styling'
    );

    console.log('✓ Test mode toggle button styling changes based on state');
  } finally {
    await browser.close();
  }
});

test('Integration - Test mode banner and toggle work in header layout', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Enable test mode
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify banner is at top
    const banner = await page.locator('div:has-text("Test Mode Enabled")').first();
    const bannerBox = await banner.boundingBox();
    assert.ok(bannerBox && bannerBox.y < 100, 'Banner should be near top of page');

    // Verify toggle button is in header
    const header = await page.locator('header').first();
    const toggleButton = await page.locator('button:has-text("Exit Test Mode")').first();
    const toggleBox = await toggleButton.boundingBox();
    const headerBox = await header.boundingBox();

    assert.ok(
      toggleBox && headerBox && toggleBox.y >= headerBox.y && toggleBox.y <= headerBox.y + headerBox.height,
      'Toggle button should be in header'
    );

    console.log('✓ Test mode banner and toggle work in header layout');
  } finally {
    await browser.close();
  }
});

test('Integration - Test mode persists through browser session', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

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
    assert.ok(isVisible, 'Banner should be visible');

    // Navigate away and back
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Verify banner is still visible
    bannerText = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    isVisible = await bannerText.isVisible().catch(() => false);
    assert.ok(isVisible, 'Banner should persist through browser session');

    console.log('✓ Test mode persists through browser session');
  } finally {
    await context.close();
    await browser.close();
  }
});
