'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { invoiceStatusUrl } from '@/lib/sse';

export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

const TERMINAL: InvoiceStatus[] = ['paid', 'expired', 'cancelled'];
const MAX_RECONNECTS = 8;
const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

export function useInvoiceStatus(invoiceId: string) {
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [paidAt, setPaidAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reconnects = useRef(0);
  const esRef = useRef<EventSource | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    setError(null);
    reconnects.current = 0;

    const es = new EventSource(invoiceStatusUrl(invoiceId));
    esRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) setStatus(data.status);
      if (data.paid_at) setPaidAt(data.paid_at);
      setLoading(false);
      reconnects.current = 0;
      if (TERMINAL.includes(data.status)) es.close();
    };

    es.onerror = () => {
      es.close();
      if (reconnects.current >= MAX_RECONNECTS) {
        setError('Connection lost');
        setLoading(false);
        return;
      }
      const delay = Math.min(BASE_DELAY_MS * 2 ** reconnects.current, MAX_DELAY_MS);
      reconnects.current += 1;
      timerRef.current = setTimeout(connect, delay);
    };
  }, [invoiceId]);

  useEffect(() => {
    if (!invoiceId) return;
    connect();
    return () => {
      esRef.current?.close();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [invoiceId, connect]);

  const retry = useCallback(() => {
    esRef.current?.close();
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);
    connect();
  }, [connect]);

  return { status, paidAt, loading, error, retry };
}
