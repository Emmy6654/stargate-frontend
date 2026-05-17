'use client';

import { useEffect, useState } from 'react';
import { AmountDisplay } from './AmountDisplay';
import { PaymentStatus } from './PaymentStatus';
import { WalletSelector } from './WalletSelector';
import { useInvoiceStatus } from '@/hooks/useInvoiceStatus';
import { useWallet } from '@/hooks/useWallet';
import { api } from '@/lib/api';

export function PaymentWidget({ invoiceId, onSuccess, onError, theme = 'light' }: { invoiceId: string; onSuccess?(invoice: any): void; onError?(error: Error): void; theme?: 'light' | 'dark' }) {
  const [invoice, setInvoice] = useState<any>(null);
  const [blocked, setBlocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { status } = useInvoiceStatus(invoiceId);
  const wallet = useWallet();

  useEffect(() => { api.invoices.public(invoiceId).then(setInvoice).catch(onError); }, [invoiceId, onError]);
  useEffect(() => {
    if (status === 'paid' && invoice) {
      onSuccess?.(invoice);
      window.parent?.postMessage({ type: 'STARGATE_PAID', invoiceId, txHash: invoice.tx_hash }, '*');
    }
  }, [status, invoice, invoiceId, onSuccess]);

  async function connectAndScreen(nextWallet: any) {
    const publicKey = await wallet.connect(nextWallet);
    const result = await api.compliance.screen(publicKey);
    setBlocked(result.result === 'blocked');
  }

  async function pay() {
    if (!wallet.wallet || !wallet.publicKey) return;
    const prepared = await api.payments.prepareTx(invoiceId, wallet.publicKey);
    const signedXdr = await wallet.wallet.signTransaction(prepared.xdr, prepared.network);
    const horizon = prepared.network === 'mainnet' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
    await fetch(`${horizon}/transactions`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ tx: signedXdr }),
    });
    setSubmitted(true);
  }

  if (!invoice) return null;
  return (
    <div className={theme === 'dark' ? 'bg-ink text-white' : 'bg-white text-ink'}>
      <div className="space-y-5 rounded-md border border-slate-200 p-5">
        <div>
          <div className="text-sm text-slate-500">{invoice.merchant_name}</div>
          <AmountDisplay amount={invoice.gross_usdc} />
          <p className="mt-2 text-sm text-slate-600">{invoice.description}</p>
        </div>
        <WalletSelector wallets={wallet.wallets} onConnect={connectAndScreen} />
        {blocked && <div className="rounded-md bg-red-100 p-3 text-sm text-red-800">This wallet cannot be used for this payment.</div>}
        {wallet.publicKey && !blocked && <button className="h-10 rounded-md bg-ink px-4 text-white" onClick={pay}>Sign and pay</button>}
        {submitted && <PaymentStatus status={status} />}
      </div>
    </div>
  );
}
