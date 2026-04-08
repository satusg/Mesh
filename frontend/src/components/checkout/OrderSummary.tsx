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
    <aside className="rounded-xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-24">
      <h2 className="text-sm font-medium text-gray-500">Order summary</h2>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-semibold text-gray-900">{productName}</p>
        <span className="text-lg font-semibold text-gray-900">{formatPrice(price, currency)}</span>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Total</span>
        <span className="text-xl font-semibold text-gray-900">{formatPrice(price, currency)}</span>
      </div>
    </aside>
  )
}
