import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const highlights = [
  'Solid metal strike',
  'Capsule included',
  'Pay with crypto',
]

export function HeroSection() {
  return (
    <section className="overflow-hidden px-4 pb-24 pt-10 sm:px-6 sm:pb-32 sm:pt-14">
      <div className="mx-auto grid max-w-6xl gap-16 lg:min-h-[calc(100vh-11rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,1fr)] lg:items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            Orbital release
            <span className="h-1.5 w-1.5 rounded-full bg-[#9dd6ff]" />
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="font-serif text-6xl leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
              A quiet object for a digital currency.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              The physical USDC coin is reduced to the essentials: metal, weight, capsule, and a pay-with-crypto flow that connects familiar exchanges and wallets without manual transfer steps.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/checkout">
              <Button size="lg" className="min-w-[190px]">
                Acquire the object
              </Button>
            </Link>
            <a href="#pricing" className="text-sm font-medium text-slate-400 underline-offset-4 hover:text-white hover:underline">
              View purchase terms
            </a>
          </div>

          <div className="flex flex-wrap gap-6 border-t border-white/10 pt-7 text-sm text-slate-400">
            {highlights.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(157,214,255,0.16),_transparent_36%)]" />
          <div className="absolute h-[26rem] w-[26rem] rounded-full border border-white/6 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),rgba(255,255,255,0.02)_38%,transparent_58%)] blur-3xl" />
          <div className="absolute h-[22rem] w-[22rem] rounded-full border border-white/8" />
          <div className="relative flex h-[19rem] w-[19rem] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff9ef_0%,#f2d7a0_26%,#ad7b2f_58%,#473223_100%)] shadow-[inset_0_8px_20px_rgba(255,255,255,0.24),0_0_90px_rgba(126,176,255,0.16)]">
            <div className="flex h-[14.75rem] w-[14.75rem] items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle,#f8edd3_0%,#d7ab58_50%,#6d4820_100%)]">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.45em] text-[#6d4716]">USDC</p>
                <p className="mt-3 font-serif text-5xl text-[#5d3b15]">$</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-sm border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Metal coin, protective capsule, numbered card, one deliberate purchase.
          </div>
        </div>
      </div>
    </section>
  )
}
