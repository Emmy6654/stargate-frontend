const styles: Record<string, string> = {
  // Invoice statuses — canonical colors used across dashboard and payment pages
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  expired: 'bg-slate-200 text-slate-600',
  cancelled: 'bg-slate-200 text-slate-600',
  // Payment / transaction statuses
  confirmed: 'bg-emerald-100 text-emerald-800',
  success: 'bg-emerald-100 text-emerald-800',
  processing: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  declined: 'bg-red-100 text-red-800',
  refunded: 'bg-violet-100 text-violet-800',
  // Dispute statuses
  open: 'bg-red-100 text-red-800',
  under_review: 'bg-amber-100 text-amber-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-600',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-100 text-red-800',
  // Environment badges
  sandbox: 'bg-sky-100 text-sky-800',
  live: 'bg-emerald-100 text-emerald-800',
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${styles[status] ?? 'bg-slate-200 text-slate-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
