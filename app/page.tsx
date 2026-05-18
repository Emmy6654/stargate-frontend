import { ArrowRight, BadgeDollarSign, Globe2, RadioTower, ShieldCheck, WalletCards, Webhook } from 'lucide-react';
import Link from 'next/link';

const feed = [
  { merchant: 'Northstar Labs', amount: '$2,430.00', status: 'Confirmed', rail: 'USDC' },
  { merchant: 'Orbit Supply', amount: '$840.25', status: 'Pending', rail: 'Stellar' },
  { merchant: 'Helio Market', amount: '$19,120.00', status: 'Settled', rail: 'Bank' },
];

const features = [
  { icon: BadgeDollarSign, title: 'Accept', copy: 'One API for invoices, hosted checkout, and payment links.' },
  { icon: RadioTower, title: 'Confirm', copy: 'Reconciler-backed payment status, webhooks, and live dashboards.' },
  { icon: WalletCards, title: 'Settle', copy: 'Merchant balances, payout previews, and treasury controls.' },
  { icon: ShieldCheck, title: 'Protect', copy: 'Compliance screening, signed webhooks, and sandbox/live separation.' },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute inset-0 opacity-70">
          <div className="absolute left-1/2 top-0 h-[680px] w-[680px] -translate-x-1/2 rounded-full border border-white/10" />
          <div className="absolute left-[8%] top-[18%] h-32 w-32 rounded-full border border-mint/30" />
          <div className="absolute right-[10%] top-[12%] h-44 w-44 rounded-full border border-violet/30" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </div>
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-lg font-semibold">Stargate</Link>
          <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a href="#products" className="hover:text-white">Products</a>
            <a href="#developers" className="hover:text-white">Developers</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden h-10 items-center rounded-md px-4 text-sm text-white/80 hover:text-white sm:inline-flex">Sign in</Link>
            <Link href="/register" className="inline-flex h-10 items-center gap-2 rounded-md bg-violet px-4 text-sm font-medium text-white hover:bg-white hover:text-ink">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1fr_520px] lg:pb-24 lg:pt-16">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-mint">
              <Globe2 size={14} /> Sandbox today. Mainnet-ready when you are.
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] md:text-6xl">Accept Crypto & Fiat. Anywhere.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              Stargate gives merchants hosted checkout, Stellar USDC invoices, webhook automation, and settlement workflows in one B2B payment console.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-violet px-5 text-sm font-semibold text-white hover:bg-mint hover:text-ink">
                Start for free <ArrowRight size={16} />
              </Link>
              <Link href="/dashboard/developers" className="inline-flex h-11 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold text-white hover:bg-white hover:text-ink">
                View docs
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-sm text-white/66">
              <div><span className="block text-xl font-semibold text-white">99.99%</span> uptime target</div>
              <div><span className="block text-xl font-semibold text-white">&lt;200ms</span> API latency goal</div>
              <div><span className="block text-xl font-semibold text-white">140+</span> currencies planned</div>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
            <div className="rounded-md border border-white/10 bg-[#101526] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs uppercase text-white/48">Live payment feed</p>
                  <p className="text-lg font-semibold">Merchant operations</p>
                </div>
                <span className="rounded bg-mint/15 px-2 py-1 text-xs font-medium text-mint">Live</span>
              </div>
              <div className="space-y-3 py-4">
                {feed.map((item) => (
                  <div key={item.merchant} className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
                    <div>
                      <p className="text-sm font-medium">{item.merchant}</p>
                      <p className="mt-1 text-xs text-white/50">{item.rail} payment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.amount}</p>
                      <p className="mt-1 text-xs text-mint">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-xs text-white/55">
                <span>ETH</span>
                <span>SOL</span>
                <span>USDC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto grid max-w-7xl gap-4 px-5 py-14 md:grid-cols-4">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-md border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
            <feature.icon className="text-violet" size={22} />
            <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.copy}</p>
          </article>
        ))}
      </section>

      <section id="pricing" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-xs font-semibold uppercase text-violet">Pricing preview</p>
            <h2 className="mt-2 text-3xl font-semibold">Transparent fees before you integrate.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Model volume, settlement paths, and webhook delivery before your first live transaction. The dashboard keeps sandbox and live operations visibly separate.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-surface p-5">
            <div className="flex justify-between text-sm"><span>Monthly volume</span><span className="font-semibold">$100,000</span></div>
            <div className="mt-4 h-2 rounded-full bg-slate-200"><div className="h-2 w-2/3 rounded-full bg-violet" /></div>
            <div className="mt-5 flex justify-between border-t border-slate-200 pt-4 text-sm"><span>Estimated platform fee</span><span className="font-semibold">$500.00</span></div>
          </div>
        </div>
      </section>

      <section id="developers" className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-violet">Developers</p>
          <h2 className="mt-2 text-2xl font-semibold">Hosted checkout, signed webhooks, and a widget SDK.</h2>
        </div>
        <Link href="/dashboard/developers" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-white hover:bg-violet">
          Open developer console <Webhook size={16} />
        </Link>
      </section>
    </main>
  );
}
