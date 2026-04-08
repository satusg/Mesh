import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const highlights = [
  'Solid metal finish',
  'Protective capsule included',
  'Numbered presentation card',
]

export function HeroSection() {
  return (
    <section className="px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_420px] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-gray-500 shadow-sm">
            Collector release
            <span className="h-1.5 w-1.5 rounded-full bg-[#b58b45]" />
          </div>

          <div className="max-w-3xl space-y-5">
            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              A physical USDC coin designed to feel like a keepsake, not merch.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Made for collectors, gifting, and desk displays, the Physical USDC Coin pairs a weighty metal strike
              with minimal presentation packaging and secure crypto checkout.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/checkout">
              <Button size="lg" className="min-w-[180px]">
                Order the coin
              </Button>
            </Link>
            <a href="#pricing" className="text-sm font-medium text-gray-700 underline-offset-4 transition hover:text-gray-950 hover:underline">
              View pricing
            </a>
          </div>

          <div className="flex flex-wrap gap-6 border-t border-black/10 pt-6 text-sm text-gray-600">
            {highlights.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Collector edition</p>
              <p className="mt-1 font-serif text-2xl text-gray-950">$99</p>
            </div>
            <span className="rounded-full bg-[#f3eee7] px-3 py-1 text-xs font-medium text-gray-700">
              Small batch
            </span>
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff6e6_0%,#f0ddbc_35%,#c79a52_68%,#9b6a2d_100%)] shadow-[inset_0_8px_20px_rgba(255,255,255,0.45),0_25px_60px_rgba(155,106,45,0.2)]">
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-white/40 bg-[radial-gradient(circle,#f9edd7_0%,#d4ac67_58%,#9e6c32_100%)]">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#7a5320]">USDC</p>
                  <p className="mt-2 font-serif text-4xl text-[#6e4a1d]">$</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-black/10 py-5">
            {[
              ['Material', 'Solid metal collector coin with a warm gold-tone finish'],
              ['Presentation', 'Protective capsule and numbered insert card included'],
              ['Checkout', 'Secure crypto payment with Mesh-supported exchanges and wallets'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="max-w-[220px] text-right text-gray-700">{value}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-sm leading-6 text-gray-600">
              A more considered alternative to novelty crypto merch, shaped with the restraint and merchandising discipline of premium retail product pages.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
