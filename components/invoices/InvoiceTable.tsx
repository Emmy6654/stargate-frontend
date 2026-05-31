import Link from 'next/link';
import { Copy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface InvoiceTableProps {
  invoices: any[];
  loading?: boolean;
  error?: string | null;
  filtered?: boolean;
}

function TableShell({ children }: { children: React.ReactNode }) {
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
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
        {message}
      </td>
    </tr>
  );
}

export function InvoiceTable({ invoices, loading, error, filtered }: InvoiceTableProps) {
  if (loading) {
    return (
      <TableShell>
        {Array.from({ length: 5 }).map((_, i) => (
          <tr key={i} className="border-t border-slate-100 animate-pulse">
            {Array.from({ length: 7 }).map((_, j) => (
              <td key={j} className="px-4 py-3">
                <div className="h-4 rounded bg-slate-100" />
              </td>
            ))}
          </tr>
        ))}
      </TableShell>
    );
  }

  if (error) {
    return (
      <TableShell>
        <EmptyRow message={`Failed to load invoices: ${error}`} />
      </TableShell>
    );
  }

  if (!invoices.length) {
    return (
      <TableShell>
        <EmptyRow message={filtered ? 'No invoices match your filters.' : 'No invoices yet. Create your first invoice to get started.'} />
      </TableShell>
    );
  }

  return (
    <TableShell>
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
    </TableShell>
  );
}
