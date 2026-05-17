import Link from 'next/link';
import { Copy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function InvoiceTable({ invoices }: { invoices: any[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Invoice ID</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Gross</th>
            <th className="px-4 py-3">Fee</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-mono text-xs">{invoice.id}</td>
              <td className="px-4 py-3">{invoice.amount_usdc}</td>
              <td className="px-4 py-3">{invoice.gross_usdc}</td>
              <td className="px-4 py-3">{invoice.fee_usdc}</td>
              <td className="px-4 py-3"><Badge status={invoice.status} /></td>
              <td className="px-4 py-3">{new Date(invoice.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link className="text-ocean hover:underline" href={`/dashboard/invoices/${invoice.id}`}>Open</Link>
                  <Button className="h-8 w-8 bg-white p-0 text-ink ring-1 ring-slate-300" title="Copy payment link" onClick={() => navigator.clipboard.writeText(invoice.payment_url)}>
                    <Copy size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
