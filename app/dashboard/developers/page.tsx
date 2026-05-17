export default function DevelopersPage() {
  const snippet = `<script src="${process.env.NEXT_PUBLIC_APP_URL}/dist/stargate-widget.js"></script>
<div id="stargate-payment"></div>
<script>
  StargateWidget.mount(document.getElementById('stargate-payment'), {
    invoiceId: 'inv_xxx',
    origin: '${process.env.NEXT_PUBLIC_APP_URL}'
  });
</script>`;
  const verify = `const expected = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');
crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));`;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Developers</h1>
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Embed code</h2>
          <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{snippet}</pre>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Widget preview</h2>
          <div className="rounded-md border border-slate-200 bg-surface p-4">
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">Hosted checkout</div>
              <div className="mt-2 text-3xl font-semibold text-ink">49.00 USDC</div>
              <button className="mt-4 h-10 w-full rounded-md bg-violet text-sm font-medium text-white">Pay with Stargate</button>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Webhook signature verification</h2>
        <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{verify}</pre>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Build prompt kit</h2>
        <p className="text-sm text-slate-600">Copy-paste prompts for rebuilding the Stargate product from scratch are in <code>docs/stargate-product-build-prompts.md</code>.</p>
      </section>
    </div>
  );
}
