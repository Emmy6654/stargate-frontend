/**
 * Format currency amounts with proper symbol, decimal places, and grouping
 */

type Currency = 'USDC' | 'EURC' | 'XLM';

const CURRENCY_CONFIG: Record<Currency, { symbol: string; decimals: number }> = {
  USDC: { symbol: '$', decimals: 2 },
  EURC: { symbol: '€', decimals: 2 },
  XLM: { symbol: '✦', decimals: 7 },
};

export function formatCurrency(
  amount: number | string,
  currency: Currency = 'USDC',
  locale: string = 'en-US'
): string {
  const config = CURRENCY_CONFIG[currency];
  if (!config) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
    useGrouping: true,
  });

  const formatted = formatter.format(numAmount);
  return `${config.symbol}${formatted}`;
}

export function getCurrencySymbol(currency: Currency): string {
  const config = CURRENCY_CONFIG[currency];
  if (!config) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return config.symbol;
}

export function getCurrencyDecimals(currency: Currency): number {
  const config = CURRENCY_CONFIG[currency];
  if (!config) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return config.decimals;
}
