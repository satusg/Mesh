import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const included = [
  '50+ TypeScript components',
  'Figma design kit & tokens',
  'Dark mode & full theming',
  'WCAG 2.1 AA accessibility',
  'Lifetime updates',
  'Private GitHub repo access',
  'Discord community',
  'Priority email support',
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-gray-50 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, one-time pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            No subscriptions. No per-seat fees. One payment, lifetime access.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-sm">
          <div className="relative rounded-2xl border-2 border-brand-600 bg-white p-8 shadow-xl">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow">
                One-time purchase
              </span>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">MeshPro License</p>
              <div className="mt-3 flex items-end justify-center gap-1">
                <span className="text-5xl font-extrabold text-gray-900">$99</span>
                <span className="mb-1 text-gray-500 text-sm">USD</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">One developer license · unlimited projects</p>
            </div>

            <ul className="mt-8 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link to="/checkout">
                <Button fullWidth size="lg">
                  Buy now — $99
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              30-day money-back guarantee · Instant license delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
