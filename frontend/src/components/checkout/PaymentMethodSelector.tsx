import type { PaymentMethod } from '@/types'

interface MethodOption {
  value: PaymentMethod
  label: string
  description: string
  icon: React.ReactNode
  marks: string[]
}

const MeshIcon = () => (
  <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="7" fill="#111827"/>
    <path d="M7 16V8h1.6l3.4 4.2L15.4 8H17v8h-1.8v-5l-2.8 3.4h-.8L8.8 11v5H7z" fill="#f8fafc" />
  </svg>
)

const methods: MethodOption[] = [
  {
    value:       'MESH',
    label:       'Pay with crypto',
    description: 'Connect a trusted exchange or wallet once, review the transfer, and confirm without manual address entry.',
    icon:        <MeshIcon />,
    marks:       ['Coinbase', 'Binance', 'Kraken', 'MetaMask'],
  },
]

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange(method: PaymentMethod): void
}

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Payment method</h2>
          <p className="mt-1 text-sm text-slate-400">Prioritize the embedded Mesh flow before any manual crypto transfer fallback.</p>
        </div>
      </div>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {methods.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={[
              'grid w-full gap-4 py-5 text-left transition-all md:grid-cols-[auto_minmax(0,1fr)_auto]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050816]',
              selected === m.value
                ? 'bg-white/5'
                : 'hover:bg-white/[0.03]',
            ].join(' ')}
            aria-pressed={selected === m.value}
          >
            <div className="flex items-center gap-4">
              {m.icon}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{m.label}</span>
                  {selected === m.value && (
                    <span className="rounded-full border border-white/12 bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                      Smart Pay
                    </span>
                  )}
                </div>
                <span className="block max-w-xl text-sm leading-6 text-slate-400">{m.description}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              {m.marks.map((mark) => (
                <span
                  key={mark}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
                >
                  {mark}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end md:justify-center">
              <div
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                  selected === m.value
                    ? 'border-sky-200 bg-sky-200 text-[#050816]'
                    : 'border-white/20 text-transparent',
                ].join(' ')}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.492 6.493-6.492a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
