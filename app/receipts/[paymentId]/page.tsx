import type { Metadata } from 'next';
import { ReceiptClient } from './_client';

export const metadata: Metadata = {
  title: 'Payment Receipt – Stargate',
  description: 'Printable payment confirmation for your Stellar USDC payment.',
};

export default function ReceiptPage({ params }: { params: { paymentId: string } }) {
  return <ReceiptClient paymentId={params.paymentId} />;
}
