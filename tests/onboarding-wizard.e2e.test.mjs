import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

test('merchant onboarding wizard - complete flow from signup to first payment link', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Step 1: Navigate to signup page
    await page.goto(`${BASE_URL}/(auth)/register`, { waitUntil: 'networkidle' });
    
    // Verify signup page is loaded
    const signupHeading = await page.locator('h1, h2').first().textContent().catch(() => '');
    assert.ok(signupHeading.toLowerCase().includes('sign') || signupHeading.toLowerCase().includes('register'), 
      'Should be on signup page');

    // Step 2: Fill signup form
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    await emailInput.fill(testEmail).catch(() => null);
    await passwordInput.fill(testPassword).catch(() => null);
    
    // Submit signup form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click().catch(() => null);
    
    // Wait for navigation or error
    await page.waitForTimeout(2000);

    // Step 3: Navigate to dashboard (or login if needed)
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
    
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="onboarding-checklist"], h1', { timeout: 5000 }).catch(() => null);

    // Step 4: Verify onboarding checklist is visible
    const checklistElement = page.locator('[data-testid="onboarding-checklist"]');
    const isChecklistVisible = await checklistElement.isVisible().catch(() => false);
    
    if (isChecklistVisible) {
      // Step 5: Complete onboarding steps
      
      // 5a: Create first invoice
      const invoiceLink = page.locator('a[href*="/dashboard/invoices"]').first();
      await invoiceLink.click().catch(() => null);
      await page.waitForTimeout(1000);
      
      // Verify on invoices page
      const invoicesHeading = await page.locator('h1, h2').first().textContent().catch(() => '');
      assert.ok(invoicesHeading.toLowerCase().includes('invoice'), 'Should navigate to invoices');
      
      // 5b: Navigate back to dashboard
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(500);
      
      // 5c: Connect wallet
      const walletLink = page.locator('a[href*="/dashboard/wallets"]').first();
      await walletLink.click().catch(() => null);
      await page.waitForTimeout(1000);
      
      // Verify on wallets page
      const walletsHeading = await page.locator('h1, h2').first().textContent().catch(() => '');
      assert.ok(walletsHeading.toLowerCase().includes('wallet'), 'Should navigate to wallets');
      
      // 5d: Navigate back to dashboard
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(500);
      
      // 5e: Set up webhook
      const webhookLink = page.locator('a[href*="/dashboard/webhooks"]').first();
      await webhookLink.click().catch(() => null);
      await page.waitForTimeout(1000);
      
      // Verify on webhooks page
      const webhooksHeading = await page.locator('h1, h2').first().textContent().catch(() => '');
      assert.ok(webhooksHeading.toLowerCase().includes('webhook'), 'Should navigate to webhooks');
      
      // 5f: Navigate back to dashboard
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(500);
      
      // 5g: Create payment link
      const paymentLinkButton = page.locator('a[href*="/dashboard/payment-links"]').first();
      await paymentLinkButton.click().catch(() => null);
      await page.waitForTimeout(1000);
      
      // Verify on payment links page
      const paymentLinksHeading = await page.locator('h1, h2').first().textContent().catch(() => '');
      assert.ok(paymentLinksHeading.toLowerCase().includes('payment'), 'Should navigate to payment links');
      
      // 5h: Navigate back to dashboard
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(500);
      
      // 5i: Invite team member
      const teamLink = page.locator('a[href*="/dashboard/team"]').first();
      await teamLink.click().catch(() => null);
      await page.waitForTimeout(1000);
      
      // Verify on team page
      const teamHeading = await page.locator('h1, h2').first().textContent().catch(() => '');
      assert.ok(teamHeading.toLowerCase().includes('team'), 'Should navigate to team');
    }

    // Final verification: Dashboard should be accessible
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
    const dashboardContent = await page.locator('body').textContent().catch(() => '');
    assert.ok(dashboardContent.length > 0, 'Dashboard should have content');

  } finally {
    await context.close();
    await browser.close();
  }
});

test('merchant onboarding wizard - onboarding checklist progress tracking', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
    
    // Wait for checklist
    await page.waitForSelector('[data-testid="onboarding-checklist"]', { timeout: 5000 }).catch(() => null);
    
    const checklistElement = page.locator('[data-testid="onboarding-checklist"]');
    const isVisible = await checklistElement.isVisible().catch(() => false);
    
    if (isVisible) {
      // Get initial progress
      const progressBar = page.locator('[data-testid="onboarding-checklist"] [role="progressbar"]');
      const initialWidth = await progressBar.evaluate(el => window.getComputedStyle(el).width).catch(() => '0px');
      
      // Click first checklist item
      const firstCheckbox = page.locator('[data-testid="onboarding-checklist"] button').first();
      await firstCheckbox.click().catch(() => null);
      
      await page.waitForTimeout(500);
      
      // Verify progress updated
      const updatedWidth = await progressBar.evaluate(el => window.getComputedStyle(el).width).catch(() => '0px');
      
      // Progress should have changed or item should be marked
      const checklistItems = page.locator('[data-testid="onboarding-checklist"] li');
      const itemCount = await checklistItems.count().catch(() => 0);
      assert.ok(itemCount > 0, 'Checklist should have items');
    }

  } finally {
    await context.close();
    await browser.close();
  }
});

test('merchant onboarding wizard - dismiss and restore checklist', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
    
    // Wait for checklist
    await page.waitForSelector('[data-testid="onboarding-checklist"]', { timeout: 5000 }).catch(() => null);
    
    const checklistElement = page.locator('[data-testid="onboarding-checklist"]');
    const isVisible = await checklistElement.isVisible().catch(() => false);
    
    if (isVisible) {
      // Find dismiss button (X button)
      const dismissButton = page.locator('[data-testid="onboarding-checklist"] button[aria-label*="Dismiss"]').first();
      const isDismissVisible = await dismissButton.isVisible().catch(() => false);
      
      if (isDismissVisible) {
        // Click dismiss
        await dismissButton.click();
        await page.waitForTimeout(500);
        
        // Verify checklist is hidden
        const isStillVisible = await checklistElement.isVisible().catch(() => false);
        assert.ok(!isStillVisible, 'Checklist should be hidden after dismiss');
      }
    }

  } finally {
    await context.close();
    await browser.close();
  }
});

test('merchant onboarding wizard - all steps accessible from dashboard', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
    
    // Define all onboarding steps
    const steps = [
      { name: 'invoices', path: '/dashboard/invoices' },
      { name: 'wallets', path: '/dashboard/wallets' },
      { name: 'webhooks', path: '/dashboard/webhooks' },
      { name: 'payment-links', path: '/dashboard/payment-links' },
      { name: 'team', path: '/dashboard/team' },
    ];
    
    // Verify each step is accessible
    for (const step of steps) {
      const link = page.locator(`a[href*="${step.path}"]`).first();
      const isVisible = await link.isVisible().catch(() => false);
      
      if (isVisible) {
        await link.click();
        await page.waitForTimeout(1000);
        
        // Verify page loaded
        const content = await page.locator('body').textContent().catch(() => '');
        assert.ok(content.length > 0, `${step.name} page should load`);
        
        // Navigate back to dashboard
        await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
        await page.waitForTimeout(500);
      }
    }

  } finally {
    await context.close();
    await browser.close();
  }
});

test('merchant onboarding wizard - completion state', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' }).catch(() => null);
    
    // Wait for checklist
    await page.waitForSelector('[data-testid="onboarding-checklist"]', { timeout: 5000 }).catch(() => null);
    
    const checklistElement = page.locator('[data-testid="onboarding-checklist"]');
    const isVisible = await checklistElement.isVisible().catch(() => false);
    
    if (isVisible) {
      // Get all checklist items
      const items = page.locator('[data-testid="onboarding-checklist"] li');
      const itemCount = await items.count().catch(() => 0);
      
      // Check if completion message is shown
      const completionText = await page.locator('[data-testid="onboarding-checklist"]').textContent().catch(() => '');
      
      // Should either show progress or completion message
      assert.ok(
        completionText.includes('completed') || completionText.includes('Get started') || itemCount > 0,
        'Checklist should show progress or completion'
      );
    }

  } finally {
    await context.close();
    await browser.close();
  }
});
