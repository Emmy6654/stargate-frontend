import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * Component Unit Tests: TestModeBanner & TestModeToggle
 * 
 * This test suite validates individual component behavior:
 * 1. TestModeBanner component rendering
 * 2. TestModeBanner component state management
 * 3. TestModeToggle component rendering
 * 4. TestModeToggle component state management
 * 5. Component event handling
 */

test('TestModeBanner Component - Renders when test mode is enabled', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Set test mode to true
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check if banner is rendered
    const banner = await page.locator('div:has-text("Test Mode Enabled - Using Testnet Data")').first();
    const isRendered = await banner.isVisible().catch(() => false);

    assert.ok(isRendered, 'TestModeBanner should render when test mode is enabled');
    console.log('✓ TestModeBanner renders when test mode is enabled');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Does not render when test mode is disabled', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Set test mode to false
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check if banner is not rendered
    const banner = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const isRendered = await banner.isVisible().catch(() => false);

    assert.ok(!isRendered, 'TestModeBanner should not render when test mode is disabled');
    console.log('✓ TestModeBanner does not render when test mode is disabled');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Displays correct text content', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check for specific text
    const banner = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const text = await banner.textContent();

    assert.ok(
      text.includes('Test Mode Enabled'),
      'Banner should display "Test Mode Enabled" text'
    );

    assert.ok(
      text.includes('Testnet Data'),
      'Banner should display "Testnet Data" text'
    );

    console.log('✓ TestModeBanner displays correct text content');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Has disable button', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check for disable button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    const isVisible = await disableButton.isVisible().catch(() => false);

    assert.ok(isVisible, 'TestModeBanner should have a Disable button');
    console.log('✓ TestModeBanner has disable button');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Disable button triggers toggle', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Get initial state
    let testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'true', 'Test mode should be enabled initially');

    // Click disable button
    const disableButton = await page.locator('button:has-text("Disable")').first();
    await disableButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // Check state changed
    testModeValue = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(testModeValue, 'false', 'Test mode should be disabled after clicking button');

    console.log('✓ TestModeBanner disable button triggers toggle');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Uses correct styling classes', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Get banner element
    const banner = await page.locator('div:has-text("Test Mode Enabled")').first();
    const classes = await banner.evaluate((el) => el.className);

    // Check for expected Tailwind classes
    assert.ok(
      classes.includes('bg-orange-50') || classes.includes('orange'),
      'Banner should have orange background'
    );

    assert.ok(
      classes.includes('border') || classes.includes('border-orange'),
      'Banner should have border styling'
    );

    assert.ok(
      classes.includes('flex'),
      'Banner should use flexbox layout'
    );

    console.log('✓ TestModeBanner uses correct styling classes');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Renders with correct initial state', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Test with disabled state
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check for enable button
    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    const isVisible = await enableButton.isVisible().catch(() => false);

    assert.ok(isVisible, 'TestModeToggle should show "Enable Test Mode" when disabled');
    console.log('✓ TestModeToggle renders with correct initial state');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Shows correct text based on state', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Test disabled state
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    let button = await page.locator('button:has-text("Enable Test Mode")').first();
    let text = await button.textContent();
    assert.ok(text.includes('Enable Test Mode'), 'Should show "Enable Test Mode" when disabled');

    // Enable test mode
    await button.click();
    await page.waitForLoadState('networkidle');

    // Test enabled state
    button = await page.locator('button:has-text("Exit Test Mode")').first();
    text = await button.textContent();
    assert.ok(text.includes('Exit Test Mode'), 'Should show "Exit Test Mode" when enabled');

    console.log('✓ TestModeToggle shows correct text based on state');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Button click triggers page reload', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Get initial URL
    const initialUrl = page.url();

    // Click enable button
    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    await enableButton.click();

    // Wait for page reload
    await page.waitForLoadState('networkidle');

    // URL should be the same (page reloaded, not navigated)
    const finalUrl = page.url();
    assert.equal(initialUrl, finalUrl, 'Page should reload, not navigate');

    console.log('✓ TestModeToggle button click triggers page reload');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Updates localStorage on click', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Start with disabled
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Click enable
    const enableButton = await page.locator('button:has-text("Enable Test Mode")').first();
    await enableButton.click();
    await page.waitForLoadState('networkidle');

    // Check localStorage
    let value = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(value, 'true', 'localStorage should be updated to true');

    // Click exit
    const exitButton = await page.locator('button:has-text("Exit Test Mode")').first();
    await exitButton.click();
    await page.waitForLoadState('networkidle');

    // Check localStorage again
    value = await page.evaluate(() => localStorage.getItem('stargate_test_mode'));
    assert.equal(value, 'false', 'localStorage should be updated to false');

    console.log('✓ TestModeToggle updates localStorage on click');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Has correct styling', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check button styling
    const button = await page.locator('button:has-text("Enable Test Mode")').first();
    const classes = await button.evaluate((el) => el.className);

    // Should have button styling
    assert.ok(
      classes.includes('primary') || classes.includes('violet') || classes.includes('bg-'),
      'Button should have styling classes'
    );

    console.log('✓ TestModeToggle has correct styling');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Is keyboard accessible', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'false');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check that button is a proper button element
    const button = await page.locator('button:has-text("Enable Test Mode")').first();
    const tagName = await button.evaluate((el) => el.tagName);

    assert.equal(tagName, 'BUTTON', 'Toggle should be a button element for keyboard accessibility');

    console.log('✓ TestModeToggle is keyboard accessible');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Disable button is keyboard accessible', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Check that disable button is a proper button element
    const button = await page.locator('button:has-text("Disable")').first();
    const tagName = await button.evaluate((el) => el.tagName);

    assert.equal(tagName, 'BUTTON', 'Disable button should be a button element for keyboard accessibility');

    console.log('✓ TestModeBanner disable button is keyboard accessible');
  } finally {
    await browser.close();
  }
});

test('TestModeBanner Component - Reads from localStorage on mount', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Set localStorage before navigation
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Banner should be visible immediately (read from localStorage on mount)
    const banner = await page.locator('text=Test Mode Enabled - Using Testnet Data').first();
    const isVisible = await banner.isVisible().catch(() => false);

    assert.ok(isVisible, 'Banner should read from localStorage on mount');

    console.log('✓ TestModeBanner reads from localStorage on mount');
  } finally {
    await browser.close();
  }
});

test('TestModeToggle Component - Reads from localStorage on mount', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Set localStorage before navigation
    await page.evaluate(() => {
      localStorage.setItem('stargate_test_mode', 'true');
    });

    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Toggle should show "Exit Test Mode" (read from localStorage on mount)
    const button = await page.locator('button:has-text("Exit Test Mode")').first();
    const isVisible = await button.isVisible().catch(() => false);

    assert.ok(isVisible, 'Toggle should read from localStorage on mount');

    console.log('✓ TestModeToggle reads from localStorage on mount');
  } finally {
    await browser.close();
  }
});
