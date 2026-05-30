'use client';

import { useEffect, useRef, useState } from 'react';
import { invoiceStatusUrl } from '@/lib/sse';

export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

const TERMINAL: InvoiceStatus[] = ['paid', 'expired', 'cancelled'];
const MAX_RECONNECTS = 8;
const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

/**
 * Hook for real-time invoice status tracking using Server-Sent Events (SSE).
 *
 * Establishes a persistent connection to the server to receive real-time updates
 * about invoice status changes. Automatically reconnects with exponential backoff
 * if the connection drops, up to a maximum of 8 reconnection attempts.
 * Closes the connection when the invoice reaches a terminal state (paid, expired, or cancelled).
 *
 * @param {string} invoiceId - The invoice ID to track
 * @returns {Object} Invoice status and connection state
 * @returns {InvoiceStatus} status - Current invoice status ('pending', 'paid', 'expired', or 'cancelled')
 * @returns {string | null} paidAt - ISO timestamp when the invoice was paid, or null if not paid
 * @returns {boolean} loading - Whether the initial status is still being loaded
 * @returns {string | null} error - Error message if connection failed after max reconnects, or null
 *
 * @example
 * const { status, paidAt, loading, error } = useInvoiceStatus('invoice-123');
 * if (loading) return <div>Loading status...</div>;
 * if (error) return <div>Connection lost: {error}</div>;
 * if (status === 'paid') return <div>Paid at {paidAt}</div>;
 * return <div>Status: {status}</div>;
 */
export function useInvoiceStatus(invoiceId: string) {
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [paidAt, setPaidAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reconnects = useRef(0);
  const esRef = useRef<EventSource | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!invoiceId) return;

    const connect = () => {
      const es = new EventSource(invoiceStatusUrl(invoiceId));
      esRef.current = es;

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status) setStatus(data.status);
        if (data.paid_at) setPaidAt(data.paid_at);
        setLoading(false);
        reconnects.current = 0; // reset on successful message
        if (TERMINAL.includes(data.status)) es.close();
      };

      es.onerror = () => {
        es.close();
        if (reconnects.current >= MAX_RECONNECTS) {
          setError('Connection lost');
          return;
        }
        const delay = Math.min(BASE_DELAY_MS * 2 ** reconnects.current, MAX_DELAY_MS);
        reconnects.current += 1;
        timerRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      esRef.current?.close();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [invoiceId]);

  return { status, paidAt, loading, error };
}
