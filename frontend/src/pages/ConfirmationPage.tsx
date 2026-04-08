import { useParams, Link } from 'react-router-dom'
import { useOrderPolling } from '@/hooks/useCheckout'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { status, licenseKey } = useOrderPolling(orderId)
  const referenceCode = licenseKey ?? orderId

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <p className="text-gray-500">Order not found.</p>
          <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline text-sm">
            Return home
          </Link>
        </div>
      </main>
    )
  }

  // Polling / processing
  if (!status || status === 'PENDING' || status === 'AWAITING_PAYMENT' || status === 'PAID') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-gray-50">
        <Spinner size="lg" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Confirming your order…</h1>
          <p className="mt-2 text-sm text-gray-500">
            This usually takes just a few seconds. Please don't close this tab.
          </p>
        </div>
        <p className="text-xs text-gray-400">Order ID: {orderId}</p>
      </main>
    )
  }

  // Failed
  if (status === 'FAILED') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-gray-50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payment failed</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your order was not completed. Please try again or use a different wallet or exchange.
          </p>
        </div>
        <Link to="/checkout">
          <Button>Try again</Button>
        </Link>
      </main>
    )
  }

  // Fulfilled ✓
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Thank you!</h1>
        <p className="mt-3 text-gray-500">
          Your order confirmation is ready. We have emailed your receipt and will keep you updated as the order moves forward.
        </p>

        {referenceCode && (
          <div className="mt-8 rounded-xl border-2 border-brand-200 bg-brand-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-2">
              Order reference
            </p>
            <code className="block rounded-lg bg-white border border-brand-200 px-4 py-3 text-lg font-bold tracking-widest text-gray-900 select-all">
              {referenceCode}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(referenceCode)}
              className="mt-3 text-xs text-brand-600 hover:text-brand-800 underline"
            >
              Copy to clipboard
            </button>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-left space-y-4">
          <h2 className="font-semibold text-gray-900">What happens next</h2>
          <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
            <li>Keep your order reference for support and order questions.</li>
            <li>Check your inbox for the payment receipt and confirmation email.</li>
            <li>Watch for follow-up updates as the order is prepared.</li>
          </ol>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
          <a href="mailto:support@usdccoin.shop">
            <Button variant="ghost">Contact support</Button>
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-400">Order ID: {orderId}</p>
      </div>
    </main>
  )
}
