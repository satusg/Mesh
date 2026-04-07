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
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        Order Summary
      </h2>

      <div className="flex items-start justify-between gap-4">
        {/* Product icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-lg">
          M
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">{productName}</p>
          <p className="text-sm text-gray-500 mt-0.5">Developer license · Lifetime access</p>
        </div>

        <span className="font-bold text-gray-900 text-lg shrink-0">
          {formatPrice(price, currency)}
        </span>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 space-y-1.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(price, currency)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{formatPrice(price, currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <svg className="h-3.5 w-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secured by 256-bit SSL encryption
      </div>
    </div>
  )
}
