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
    <section id="pricing" className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-gray-400">Pricing</p>
            <h2 className="font-serif text-4xl tracking-tight text-gray-950">
              One purchase. One collector piece. No unnecessary extras.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-gray-600">
              A straightforward retail offer for a single physical product, with secure crypto checkout and a calmer post-purchase flow.
            </p>

            <div className="divide-y divide-black/10 border-y border-black/10 pt-2">
              {included.map((item) => (
                <div key={item} className="py-4 text-sm text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-[#f8f5f0] p-8 shadow-[0_20px_60px_rgba(17,24,39,0.06)]">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Collector edition</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-serif text-6xl leading-none text-gray-950">$99</span>
              <span className="pb-2 text-sm text-gray-500">USD</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Includes the coin, capsule, and presentation insert in one clean purchase.
            </p>

            <div className="mt-8">
              <Link to="/checkout">
                <Button fullWidth size="lg">
                  Order now
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">30-day returns. Confirmation and fulfillment updates are sent by email.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
