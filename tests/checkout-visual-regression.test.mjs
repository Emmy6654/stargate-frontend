/**
 * Visual regression tests for the hosted checkout page.
 *
 * Uses Playwright screenshots to catch unintended layout changes across
 * the three canonical breakpoints: mobile (375 px), tablet (768 px), and
 * desktop (1280 px).
 *
 * Snapshots are stored in tests/__snapshots__/checkout/ and committed to
 * source control.  On the first run the files are created automatically;
 * subsequent runs compare against those baselines.
 *
 * To update baselines intentionally:
 *   UPDATE_SNAPSHOTS=1 npm test
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const SNAPSHOT_DIR = resolve(__dirname, '__snapshots__', 'checkout');
const UPDATE = process.env.UPDATE_SNAPSHOTS === '1';

/** Breakpoints that mirror the project's Tailwind sm/md/lg boundaries. */
const BREAKPOINTS = [
  { name: 'mobile',  width: 375,  height: 812 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

/** Routes that make up the hosted checkout flow. */
const CHECKOUT_ROUTES = [
  { label: 'checkout',         path: '/pay/demo_invoice_id' },
  { label: 'checkout-success', path: '/pay/demo_invoice_id/success' },
];

/**
 * Pixel-level comparison between two PNG buffers.
 * Returns the number of differing pixels (0 = identical).
 *
 * We use a simple byte-level diff on the raw PNG data as a lightweight
 * proxy; for production use, replace with pixelmatch or @playwright/test
 * built-in snapshot support.
 */
function countDifferentBytes(a, b) {
  if (a.length !== b.length) return Math.max(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

/** Maximum tolerated byte difference (accounts for anti-aliasing noise). */
const DIFF_THRESHOLD = 500;

// Ensure snapshot directory exists.
if (!existsSync(SNAPSHOT_DIR)) {
  mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

for (const { label, path } of CHECKOUT_ROUTES) {
  for (const { name: bp, width, height } of BREAKPOINTS) {
    const snapshotName = `${label}-${bp}.png`;
    const snapshotPath = resolve(SNAPSHOT_DIR, snapshotName);

    test(`checkout visual regression – ${label} at ${bp} (${width}×${height})`, async () => {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      await page.setViewportSize({ width, height });
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

      // Allow fonts and images to settle.
      await page.waitForTimeout(300);

      const screenshot = await page.screenshot({ fullPage: true });

      await browser.close();

      if (UPDATE || !existsSync(snapshotPath)) {
        // Write / update baseline.
        writeFileSync(snapshotPath, screenshot);
        // Soft-pass: baseline created, nothing to compare yet.
        return;
      }

      const baseline = readFileSync(snapshotPath);
      const diffBytes = countDifferentBytes(baseline, screenshot);

      assert.ok(
        diffBytes <= DIFF_THRESHOLD,
        `Visual regression detected on "${label}" at ${bp} (${width}px): ` +
          `${diffBytes} bytes differ (threshold: ${DIFF_THRESHOLD}). ` +
          `Run with UPDATE_SNAPSHOTS=1 to update the baseline.`,
      );
    });
  }
}
