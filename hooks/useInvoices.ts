'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

export function useInvoices(query = '') {
  return useSWR(['invoices', query], () => api.invoices.list(query), { refreshInterval: 30_000 });
}
