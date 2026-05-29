import { Card } from '@/components/ui/Card';

export function StatsCards({ invoices }: { invoices: any[] }) {
  const paid = invoices.filter((invoice) => invoice.status === 'paid');
  const revenue = paid.reduce((sum, invoice) => sum + Number(invoice.net_usdc ?? 0), 0);
  const active = invoices.filter((invoice) => invoice.status === 'pending').length;
  const conversion = invoices.length ? Math.round((paid.length / invoices.length) * 100) : 0;
  const month = paid.filter((invoice) => new Date(invoice.created_at).getMonth() === new Date().getMonth());
  const monthEarnings = month.reduce((sum, invoice) => sum + Number(invoice.net_usdc ?? 0), 0);
  const stats = [
    ['Total revenue', `${revenue.toFixed(2)} USDC`],
    ['Active invoices', active],
    ['Conversion rate', `${conversion}%`],
    ['This month', `${monthEarnings.toFixed(2)} USDC`],
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([label, value]) => (
        <Card key={label} data-testid="stats-card">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
        </Card>
      ))}
    </div>
  );
}
