'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Hook for fetching a list of invoices with optional filtering.
 *
 * Automatically refreshes invoice data every 30 seconds to keep the list current.
 * Useful for displaying invoices in tables or lists with real-time updates.
 *
 * @param {string} [query=''] - Optional search/filter query string
 * @returns {Object} SWR response object with invoices data, loading, and error states
 *
 * @example
 * const { data: invoices, isLoading, error } = useInvoices('status:paid');
 * if (isLoading) return <div>Loading...</div>;
 * return <InvoiceList invoices={invoices} />;
 */
export function useInvoices(query = '') {
  return useSWR(['invoices', query], () => api.invoices.list(query), { refreshInterval: 30_000 });
}
