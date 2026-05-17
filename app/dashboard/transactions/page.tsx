'use client';

import { Download, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useInvoices } from '@/hooks/useInvoices';

export default function TransactionsPage() {
  const { data } = useInvoices('?limit=50');
  const transactions = data?.items ?? [];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Transactions</h1>
          <p className="text-sm text-slate-500">Invoice payments, statuses, and settlement-ready revenue.</p>
        </div>
        <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">
          <Download size={16} /> Export
        </Button>
      </div>
      <Card className="space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
          <Input className="w-full pl-9" placeholder="Search by invoice, reference, or status" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3">Transaction</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Net</th>
                <th className="py-3">Status</th>
                <th className="py-3">Created</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-100">
                  <td className="py-3 font-mono text-xs">{invoice.id}</td>
                  <td className="py-3">{invoice.gross_usdc} USDC</td>
                  <td className="py-3">{invoice.net_usdc} USDC</td>
                  <td className="py-3"><Badge status={invoice.status} /></td>
                  <td className="py-3">{new Date(invoice.created_at).toLocaleString()}</td>
                  <td className="py-3"><Link className="text-violet hover:underline" href={`/dashboard/invoices/${invoice.id}`}>View</Link></td>
                </tr>
              ))}
              {!transactions.length && (
                <tr>
                  <td className="py-8 text-center text-slate-500" colSpan={6}>No transactions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
