interface OrderSummaryProps {
  productName: string
  price: number
  currency: string
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)
}

export function OrderSummary({ productName, price, currency }: OrderSummaryProps) {
  return (
    <aside className="border-t border-white/8 pt-6 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Order summary</h2>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-semibold text-white">{productName}</p>
        <span className="text-lg font-semibold text-white">{formatPrice(price, currency)}</span>
      </div>

      <div className="mt-4 border-t border-white/8 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Total</span>
          <span className="text-xl font-semibold text-white">{formatPrice(price, currency)}</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          One object, protective capsule, numbered insert, and an embedded Mesh checkout that avoids manual QR codes and address entry.
        </p>
      </div>
    </aside>
  )
}
