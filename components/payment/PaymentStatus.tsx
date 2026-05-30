import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PaymentStatusProps {
  status: string;
  error?: string | null;
  onRetry?: () => void;
}

export function PaymentStatus({ status, error, onRetry }: PaymentStatusProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <Badge status={status} />
        <span>{error ? 'Connection lost — last known status shown above.' : 'Awaiting Stellar confirmation'}</span>
      </div>
      {error && onRetry && (
        <Button className="h-8 w-fit bg-white text-ink ring-1 ring-slate-300" onClick={onRetry}>
          Retry connection
        </Button>
      )}
    </div>
  );
}
