import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, getCurrencySymbol, getCurrencyDecimals } from '../lib/formatCurrency.ts';

test('formatCurrency - USDC formatting', async (t) => {
  await t.test('formats USDC with correct symbol and 2 decimal places', () => {
    const result = formatCurrency(100, 'USDC', 'en-US');
    assert.equal(result, '$100.00');
  });

  await t.test('formats USDC with grouping for large amounts', () => {
    const result = formatCurrency(1000000, 'USDC', 'en-US');
    assert.equal(result, '$1,000,000.00');
  });

  await t.test('handles decimal amounts correctly', () => {
    const result = formatCurrency(123.456, 'USDC', 'en-US');
    assert.equal(result, '$123.46');
  });

  await t.test('handles string amounts', () => {
    const result = formatCurrency('50.5', 'USDC', 'en-US');
    assert.equal(result, '$50.50');
  });

  await t.test('formats zero correctly', () => {
    const result = formatCurrency(0, 'USDC', 'en-US');
    assert.equal(result, '$0.00');
  });
});

test('formatCurrency - EURC formatting', async (t) => {
  await t.test('formats EURC with correct symbol and 2 decimal places', () => {
    const result = formatCurrency(100, 'EURC', 'en-US');
    assert.equal(result, '€100.00');
  });

  await t.test('formats EURC with grouping', () => {
    const result = formatCurrency(1000000, 'EURC', 'en-US');
    assert.equal(result, '€1,000,000.00');
  });

  await t.test('handles decimal amounts', () => {
    const result = formatCurrency(99.99, 'EURC', 'en-US');
    assert.equal(result, '€99.99');
  });
});

test('formatCurrency - XLM formatting', async (t) => {
  await t.test('formats XLM with correct symbol and 7 decimal places', () => {
    const result = formatCurrency(100, 'XLM', 'en-US');
    assert.equal(result, '✦100.0000000');
  });

  await t.test('formats XLM with grouping', () => {
    const result = formatCurrency(1000000, 'XLM', 'en-US');
    assert.equal(result, '✦1,000,000.0000000');
  });

  await t.test('handles decimal amounts with 7 places', () => {
    const result = formatCurrency(123.456789, 'XLM', 'en-US');
    assert.equal(result, '✦123.4567890');
  });
});

test('formatCurrency - locale support', async (t) => {
  await t.test('formats with en-US locale (comma grouping)', () => {
    const result = formatCurrency(1000, 'USDC', 'en-US');
    assert.equal(result, '$1,000.00');
  });

  await t.test('formats with de-DE locale (period grouping)', () => {
    const result = formatCurrency(1000, 'USDC', 'de-DE');
    assert.equal(result, '$1.000,00');
  });

  await t.test('formats with fr-FR locale', () => {
    const result = formatCurrency(1000, 'USDC', 'fr-FR');
    assert.match(result, /\$1[\s.]000,00/);
  });

  await t.test('formats with ja-JP locale', () => {
    const result = formatCurrency(1000, 'USDC', 'ja-JP');
    assert.equal(result, '$1,000.00');
  });
});

test('formatCurrency - error handling', async (t) => {
  await t.test('throws error for unsupported currency', () => {
    assert.throws(() => formatCurrency(100, 'BTC', 'en-US'), /Unsupported currency/);
  });

  await t.test('throws error for invalid amount string', () => {
    assert.throws(() => formatCurrency('invalid', 'USDC', 'en-US'), /Invalid amount/);
  });

  await t.test('throws error for NaN', () => {
    assert.throws(() => formatCurrency(NaN, 'USDC', 'en-US'), /Invalid amount/);
  });
});

test('formatCurrency - edge cases', async (t) => {
  await t.test('handles very small amounts', () => {
    const result = formatCurrency(0.01, 'USDC', 'en-US');
    assert.equal(result, '$0.01');
  });

  await t.test('handles negative amounts', () => {
    const result = formatCurrency(-100, 'USDC', 'en-US');
    assert.equal(result, '$-100.00');
  });

  await t.test('defaults to USDC when currency not specified', () => {
    const result = formatCurrency(100);
    assert.equal(result, '$100.00');
  });

  await t.test('defaults to en-US when locale not specified', () => {
    const result = formatCurrency(1000, 'USDC');
    assert.equal(result, '$1,000.00');
  });
});

test('getCurrencySymbol', async (t) => {
  await t.test('returns correct symbol for USDC', () => {
    assert.equal(getCurrencySymbol('USDC'), '$');
  });

  await t.test('returns correct symbol for EURC', () => {
    assert.equal(getCurrencySymbol('EURC'), '€');
  });

  await t.test('returns correct symbol for XLM', () => {
    assert.equal(getCurrencySymbol('XLM'), '✦');
  });

  await t.test('throws error for unsupported currency', () => {
    assert.throws(() => getCurrencySymbol('BTC'), /Unsupported currency/);
  });
});

test('getCurrencyDecimals', async (t) => {
  await t.test('returns 2 decimals for USDC', () => {
    assert.equal(getCurrencyDecimals('USDC'), 2);
  });

  await t.test('returns 2 decimals for EURC', () => {
    assert.equal(getCurrencyDecimals('EURC'), 2);
  });

  await t.test('returns 7 decimals for XLM', () => {
    assert.equal(getCurrencyDecimals('XLM'), 7);
  });

  await t.test('throws error for unsupported currency', () => {
    assert.throws(() => getCurrencyDecimals('BTC'), /Unsupported currency/);
  });
});
