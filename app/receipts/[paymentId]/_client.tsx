'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PublicInvoice } from '@/types/api';
import { Badge } from '@/components/ui/Badge';

const STELLAR_EXPERT_BASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
    ? 'https://stellar.expert/explorer/public/tx'
    : 'https://stellar.expert/explorer/testnet/tx';

function getStellarExpertUrl(txHash: string): string {
  return `${STELLAR_EXPERT_BASE}/${txHash}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className ?? ''}`} />;
}

function ReceiptSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-6 w-20" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReceiptClient({ paymentId }: { paymentId: string }) {
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.invoices
      .public(paymentId)
      .then((data) => {
        setInvoice(data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load receipt.');
      })
      .finally(() => setLoading(false));
  }, [paymentId]);

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-6 print:p-0">
      {/* Print-only header */}
      <div className="mb-6 hidden print:block">
        <p className="text-xs text-slate-500">Stargate – USDC Payments on Stellar</p>
      </div>

      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold text-ink">Payment Receipt</h1>
        <button
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="Print receipt"
        >
          Print
        </button>
      </div>

      {/* Print heading */}
      <h1 className="mb-6 hidden text-2xl font-semibold text-ink print:block">
        Payment Receipt
      </h1>

      {loading && <ReceiptSkeleton />}

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {!loading && !error && invoice && (
        <div className="space-y-6">
          {/* Status banner */}
          {invoice.status !== 'paid' && (
            <div
              role="alert"
              className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              This receipt is only available for completed payments. Current status:{' '}
              <strong className="capitalize">{invoice.status}</strong>.
            </div>
          )}

          {/* Receipt card */}
          <section
            aria-label="Receipt details"
            className="rounded-md border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none"
          >
            {/* Header row */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">From</p>
                <p className="font-medium text-ink">{invoice.merchant_name}</p>
              </div>
              <Badge status={invoice.status} />
            </div>

            {/* Amount */}
            <div className="mb-6">
              <p className="text-sm text-slate-500">Amount paid</p>
              <p className="text-4xl font-semibold text-ink">
                {invoice.gross_usdc}{' '}
                <span className="text-base font-normal text-slate-500">USDC</span>
              </p>
            </div>

            {/* Details grid */}
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Payment ID</dt>
                <dd className="break-all font-mono text-xs text-ink">{invoice.id}</dd>
              </div>

              {invoice.description && (
                <div>
                  <dt className="text-slate-500">Description</dt>
                  <dd className="text-ink">{invoice.description}</dd>
                </div>
              )}

              {invoice.paid_at && (
                <div>
                  <dt className="text-slate-500">Paid at</dt>
                  <dd className="text-ink">{formatDate(invoice.paid_at)}</dd>
                </div>
              )}

              {invoice.tx_hash && (
                <div>
                  <dt className="text-slate-500">Stellar transaction ID</dt>
                  <dd className="break-all font-mono text-xs text-ink">
                    <a
                      href={getStellarExpertUrl(invoice.tx_hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet underline hover:text-ocean print:no-underline print:text-ink"
                      aria-label={`View transaction ${invoice.tx_hash} on Stellar Expert`}
                    >
                      {invoice.tx_hash}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Print footer */}
          <p className="text-center text-xs text-slate-400 print:mt-8">
            Powered by Stargate · stargate.finance
          </p>
        </div>
      )}
    </main>
  );
}
