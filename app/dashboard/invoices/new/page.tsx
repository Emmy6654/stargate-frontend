import { CreateInvoiceForm } from '@/components/invoices/CreateInvoiceForm';

export default function NewInvoicePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-ink">Create invoice</h1>
      <CreateInvoiceForm />
    </div>
  );
}
