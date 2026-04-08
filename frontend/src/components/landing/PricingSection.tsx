import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const included = [
  'One physical USDC collector coin',
  'Protective display capsule',
  'Numbered presentation card',
  'Email confirmation and order updates',
]

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 border-y border-white/8 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Purchase</p>
            <h2 className="font-serif text-5xl tracking-tight text-white">
              One object. One payment. Nothing extra.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-400">
              The offer stays compact: one collector coin, one capsule, one numbered insert, and status updates after purchase.
            </p>

            <div className="divide-y divide-white/8 border-t border-white/8 pt-3">
              {included.map((item) => (
                <div key={item} className="py-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 border-t border-white/8 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Collector edition</p>
            <div className="flex items-end gap-2">
              <span className="font-serif text-7xl leading-none text-white">$99</span>
              <span className="pb-2 text-sm text-slate-500">USD</span>
            </div>
            <p className="text-sm leading-7 text-slate-400">
              One-time purchase. Pay with crypto through trusted exchanges and wallets using Mesh’s embedded checkout. Fulfillment updates by email.
            </p>

            <div>
              <Link to="/checkout">
                <Button fullWidth size="lg">
                  Proceed to checkout
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-500">30-day returns.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
