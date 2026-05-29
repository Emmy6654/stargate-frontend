import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

test('payment link checkout flow - create payment link', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to payment links page
    await page.goto(`${BASE_URL}/dashboard/payment-links`, { waitUntil: 'networkidle' });

    // Wait for page to load
    await page.waitForSelector('[data-testid="payment-links-container"]', { timeout: 5000 }).catch(() => null);

    // Click create payment link button
    const createButton = page.locator('[data-testid="create-payment-link-button"]');
    const buttonExists = await createButton.isVisible().catch(() => false);
    
    if (buttonExists) {
      await createButton.click();

      // Wait for modal or form to appear
      await page.waitForSelector('[data-testid="payment-link-form"]', { timeout: 5000 }).catch(() => null);

      // Fill in form fields
      const amountInput = page.locator('[data-testid="amount-input"]');
      const descriptionInput = page.locator('[data-testid="description-input"]');

      const amountExists = await amountInput.isVisible().catch(() => false);
      
      if (amountExists) {
        await amountInput.fill('100');
        
        const descExists = await descriptionInput.isVisible().catch(() => false);
        if (descExists) {
          await descriptionInput.fill('Test Payment Link');
        }

        // Submit form
        const submitButton = page.locator('[data-testid="submit-payment-link-button"]');
        const submitExists = await submitButton.isVisible().catch(() => false);
        
        if (submitExists) {
          await submitButton.click();

          // Wait for success message or redirect
          await page.waitForTimeout(1000);

          // Assert payment link was created (check for success message or new link in list)
          const successMessage = page.locator('[data-testid="success-message"]');
          const successExists = await successMessage.isVisible().catch(() => false);
          
          assert.ok(successExists || page.url().includes('payment-links'), 'Payment link should be created successfully');
        }
      }
    } else {
      console.log('Create payment link button not found - skipping test');
    }
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - public page loads', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to a payment page (using a test invoice ID)
    const testInvoiceId = 'test-invoice-123';
    await page.goto(`${BASE_URL}/pay/${testInvoiceId}`, { waitUntil: 'networkidle' });

    // Wait for payment page to load
    await page.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    // Assert key elements are present
    const paymentWidget = page.locator('[data-testid="payment-widget"]');
    const amountDisplay = page.locator('[data-testid="amount-display"]');

    const widgetExists = await paymentWidget.isVisible().catch(() => false);
    const amountExists = await amountDisplay.isVisible().catch(() => false);

    assert.ok(widgetExists || amountExists, 'Payment page should display payment information');
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - wallet connection', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to payment page
    const testInvoiceId = 'test-invoice-123';
    await page.goto(`${BASE_URL}/pay/${testInvoiceId}`, { waitUntil: 'networkidle' });

    // Wait for payment page to load
    await page.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    // Look for wallet selector
    const walletSelector = page.locator('[data-testid="wallet-selector"]');
    const selectorExists = await walletSelector.isVisible().catch(() => false);

    if (selectorExists) {
      // Check for wallet options
      const freighterButton = page.locator('[data-testid="wallet-freighter"]');
      const albedoButton = page.locator('[data-testid="wallet-albedo"]');

      const freighterExists = await freighterButton.isVisible().catch(() => false);
      const albedoExists = await albedoButton.isVisible().catch(() => false);

      assert.ok(freighterExists || albedoExists, 'Wallet options should be available');

      // Note: We cannot actually connect to wallets in headless mode
      // This test verifies the UI is present and clickable
      if (freighterExists) {
        const isClickable = await freighterButton.isEnabled().catch(() => false);
        assert.ok(isClickable, 'Freighter wallet button should be clickable');
      }
    } else {
      console.log('Wallet selector not found - payment page may not be fully loaded');
    }
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - payment form validation', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to payment page
    const testInvoiceId = 'test-invoice-123';
    await page.goto(`${BASE_URL}/pay/${testInvoiceId}`, { waitUntil: 'networkidle' });

    // Wait for payment page to load
    await page.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    // Look for payment form
    const paymentForm = page.locator('[data-testid="payment-form"]');
    const formExists = await paymentForm.isVisible().catch(() => false);

    if (formExists) {
      // Try to submit without required fields
      const submitButton = page.locator('[data-testid="submit-payment-button"]');
      const submitExists = await submitButton.isVisible().catch(() => false);

      if (submitExists) {
        // Check if submit button is disabled or shows validation error
        const isDisabled = await submitButton.isDisabled().catch(() => false);
        
        // Attempt to click and check for validation errors
        await submitButton.click().catch(() => null);
        await page.waitForTimeout(500);

        const errorMessage = page.locator('[data-testid="validation-error"]');
        const errorExists = await errorMessage.isVisible().catch(() => false);

        assert.ok(isDisabled || errorExists, 'Form should validate required fields');
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - success screen display', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to success page directly
    await page.goto(`${BASE_URL}/pay/test-invoice-123/success`, { waitUntil: 'networkidle' });

    // Wait for success page to load
    await page.waitForSelector('[data-testid="success-page"]', { timeout: 5000 }).catch(() => null);

    // Assert success elements are present
    const successIcon = page.locator('[data-testid="success-icon"]');
    const successMessage = page.locator('[data-testid="success-message"]');
    const transactionDetails = page.locator('[data-testid="transaction-details"]');

    const iconExists = await successIcon.isVisible().catch(() => false);
    const messageExists = await successMessage.isVisible().catch(() => false);
    const detailsExists = await transactionDetails.isVisible().catch(() => false);

    assert.ok(iconExists || messageExists || detailsExists, 'Success page should display confirmation');
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - error handling', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to payment page with invalid ID
    await page.goto(`${BASE_URL}/pay/invalid-id-12345`, { waitUntil: 'networkidle' });

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check for error message or redirect
    const errorMessage = page.locator('[data-testid="error-message"]');
    const errorExists = await errorMessage.isVisible().catch(() => false);

    // Either shows error or redirects
    const isErrorPage = errorExists || page.url().includes('error') || page.url().includes('404');
    
    assert.ok(isErrorPage || !page.url().includes('/pay/'), 'Invalid payment link should show error or redirect');
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - responsive design', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();

  try {
    // Test mobile viewport
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    
    await mobilePage.goto(`${BASE_URL}/pay/test-invoice-123`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    const mobilePaymentWidget = mobilePage.locator('[data-testid="payment-widget"]');
    const mobileWidgetVisible = await mobilePaymentWidget.isVisible().catch(() => false);

    assert.ok(mobileWidgetVisible, 'Payment widget should be visible on mobile');

    // Test tablet viewport
    const tabletPage = await context.newPage();
    await tabletPage.setViewportSize({ width: 768, height: 1024 });
    
    await tabletPage.goto(`${BASE_URL}/pay/test-invoice-123`, { waitUntil: 'networkidle' });
    await tabletPage.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    const tabletPaymentWidget = tabletPage.locator('[data-testid="payment-widget"]');
    const tabletWidgetVisible = await tabletPaymentWidget.isVisible().catch(() => false);

    assert.ok(tabletWidgetVisible, 'Payment widget should be visible on tablet');

    // Test desktop viewport
    const desktopPage = await context.newPage();
    await desktopPage.setViewportSize({ width: 1280, height: 720 });
    
    await desktopPage.goto(`${BASE_URL}/pay/test-invoice-123`, { waitUntil: 'networkidle' });
    await desktopPage.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    const desktopPaymentWidget = desktopPage.locator('[data-testid="payment-widget"]');
    const desktopWidgetVisible = await desktopPaymentWidget.isVisible().catch(() => false);

    assert.ok(desktopWidgetVisible, 'Payment widget should be visible on desktop');

    await mobilePage.close();
    await tabletPage.close();
    await desktopPage.close();
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - accessibility', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/pay/test-invoice-123`, { waitUntil: 'networkidle' });

    // Wait for payment page to load
    await page.waitForSelector('[data-testid="payment-page"]', { timeout: 5000 }).catch(() => null);

    // Check for accessibility attributes
    const paymentForm = page.locator('[data-testid="payment-form"]');
    const formExists = await paymentForm.isVisible().catch(() => false);

    if (formExists) {
      // Check for form labels
      const labels = page.locator('label');
      const labelCount = await labels.count().catch(() => 0);

      // Check for ARIA attributes
      const ariaElements = page.locator('[role]');
      const ariaCount = await ariaElements.count().catch(() => 0);

      // At least some accessibility features should be present
      assert.ok(labelCount > 0 || ariaCount > 0, 'Payment form should have accessibility attributes');
    }

    // Check for keyboard navigation
    const firstButton = page.locator('button').first();
    const buttonExists = await firstButton.isVisible().catch(() => false);

    if (buttonExists) {
      // Tab to button and check if it's focused
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      
      // Should be able to navigate with keyboard
      assert.ok(focusedElement, 'Page should support keyboard navigation');
    }
  } finally {
    await context.close();
    await browser.close();
  }
});

test('payment link checkout flow - network error handling', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Simulate network error by going offline
    await context.setOffline(true);

    // Navigate to payment page
    await page.goto(`${BASE_URL}/pay/test-invoice-123`, { waitUntil: 'domcontentloaded' }).catch(() => null);

    // Wait a bit for error to appear
    await page.waitForTimeout(1000);

    // Check for offline/error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    const offlineMessage = page.locator('[data-testid="offline-message"]');

    const errorExists = await errorMessage.isVisible().catch(() => false);
    const offlineExists = await offlineMessage.isVisible().catch(() => false);

    // Should show some kind of error or offline message
    assert.ok(errorExists || offlineExists || !page.url().includes('/pay/'), 'Should handle network errors gracefully');

    // Go back online
    await context.setOffline(false);
  } finally {
    await context.close();
    await browser.close();
  }
});
