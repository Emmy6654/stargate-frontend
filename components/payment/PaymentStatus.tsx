import { Badge } from '@/components/ui/Badge';

export function PaymentStatus({ status }: { status: string }) {
  return <div className="flex items-center gap-2 text-sm"><Badge status={status} /> <span>Awaiting Stellar confirmation</span></div>;
}
