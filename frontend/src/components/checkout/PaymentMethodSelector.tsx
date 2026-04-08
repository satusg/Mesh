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
    <rect width="24" height="24" rx="7" fill="#4f46e5"/>
    <path d="M7 16V8h1.6l3.4 4.2L15.4 8H17v8h-1.8v-5l-2.8 3.4h-.8L8.8 11v5H7z" fill="white" />
  </svg>
)

const methods: MethodOption[] = [
  {
    value:       'MESH',
    label:       'Pay with crypto',
    description: 'Secure one-click transfer from trusted exchanges and wallets.',
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
      <div className="border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
          <p className="mt-1 text-sm text-gray-500">Use the recommended crypto flow below.</p>
        </div>
      </div>

      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {methods.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={[
              'grid w-full gap-4 py-5 text-left transition-all md:grid-cols-[auto_minmax(0,1fr)_auto]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4',
              selected === m.value
                ? 'bg-brand-50/50'
                : 'hover:bg-gray-50/80',
            ].join(' ')}
            aria-pressed={selected === m.value}
          >
            <div className="flex items-center gap-4">
              {m.icon}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{m.label}</span>
                  {selected === m.value && (
                    <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="block max-w-xl text-sm leading-6 text-gray-500">{m.description}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              {m.marks.map((mark) => (
                <span
                  key={mark}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm"
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
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-300 text-transparent',
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
