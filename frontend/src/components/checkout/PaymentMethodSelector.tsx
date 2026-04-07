import type { PaymentMethod } from '@/types'

interface MethodOption {
  value: PaymentMethod
  label: string
  description: string
  icon: React.ReactNode
}

const MeshIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#4f46e5"/>
    <text x="12" y="16" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">₿</text>
  </svg>
)

const methods: MethodOption[] = [
  {
    value:       'MESH',
    label:       'Crypto',
    description: 'Coinbase & 300+',
    icon:        <MeshIcon />,
  },
]

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange(method: PaymentMethod): void
}

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">Payment method</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {methods.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={[
              'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              selected === m.value
                ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
            ].join(' ')}
            aria-pressed={selected === m.value}
          >
            {m.icon}
            <span className="text-xs font-medium text-gray-900 leading-tight">{m.label}</span>
            <span className="hidden text-xs text-gray-500 sm:block">{m.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
