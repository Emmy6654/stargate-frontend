export default function SuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold text-ink">Payment confirmed</h1>
      <p className="text-slate-600">The Stellar payment has been reconciled and the merchant has been notified.</p>
    </main>
  );
}
