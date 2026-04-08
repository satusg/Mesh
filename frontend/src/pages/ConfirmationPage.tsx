import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useOrderPolling } from '@/hooks/useCheckout'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { order, status, licenseKey, error, isLoaded } = useOrderPolling(orderId)
  const [copied, setCopied] = useState(false)

  const referenceCode = licenseKey ?? orderId

  const setupSteps = useMemo(() => [
    {
      title: 'Save your reference',
      body: 'Keep the configuration reference handy so support can trace this order quickly if you need help later.',
    },
    {
      title: 'Watch your inbox',
      body: order?.customer.email
        ? `We will send updates to ${order.customer.email} as the order moves through review and fulfillment.`
        : 'We will send updates to the email address used at checkout as the order moves through review and fulfillment.',
    },
    {
      title: 'Reach out if anything changed',
      body: 'If shipping or buyer details need to be corrected, contact support before the order enters the next handling step.',
    },
  ], [order?.customer.email])

  const handleCopyReference = async () => {
    if (!referenceCode) return

    try {
      await navigator.clipboard.writeText(referenceCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 py-16 text-center text-white">
        <div className="max-w-md">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Missing order</p>
          <p className="mt-4 text-base leading-7 text-slate-300">Order not found.</p>
          <Link to="/" className="mt-6 inline-block text-sm text-slate-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">
            Return home
          </Link>
        </div>
      </main>
    )
  }

  if (isLoaded && error) {
    const isMissingOrder = error.toLowerCase().includes('order not found')

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 py-16 text-center text-white">
        <div className="max-w-md">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${isMissingOrder ? 'border-amber-300/20 bg-amber-300/10' : 'border-red-300/20 bg-red-300/10'}`}>
            <svg className={`h-8 w-8 ${isMissingOrder ? 'text-amber-200' : 'text-red-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMissingOrder ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
              )}
            </svg>
          </div>
          <h1 className="mt-6 font-serif text-3xl text-white">
            {isMissingOrder ? 'Order confirmation not found' : 'Confirmation page unavailable'}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {isMissingOrder
              ? 'We could not find a confirmation record for this order ID. Double-check the link or contact support if you expected this page to exist.'
              : 'We were not able to load the confirmation details right now. Please refresh in a moment or contact support if the issue continues.'}
          </p>
          <p className="mt-5 break-all text-xs uppercase tracking-[0.22em] text-slate-500">Order ID: {orderId}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button variant="secondary">Back to home</Button>
            </Link>
            <a href="mailto:support@usdccoin.shop">
              <Button variant="ghost">Contact support</Button>
            </a>
          </div>
        </div>
      </main>
    )
  }

  if (!status || status === 'PENDING' || status === 'AWAITING_PAYMENT' || status === 'PAID') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050816] px-6 py-16 text-center text-white">
        <Spinner size="lg" />
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Configuration record</p>
          <h1 className="mt-4 font-serif text-3xl text-white">Preparing your configuration workspace...</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This usually takes just a few seconds. Please do not close this tab.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Order ID: {orderId}</p>
      </main>
    )
  }

  if (status === 'FAILED') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050816] px-6 py-16 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-300/20 bg-red-300/10">
          <svg className="h-8 w-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Payment state</p>
          <h1 className="mt-4 font-serif text-3xl text-white">Payment failed</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Your order was not completed. Please try again or use a different wallet or exchange.
          </p>
        </div>
        <Link to="/checkout">
          <Button>Try again</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.14),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(244,244,245,0.08),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0))]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_320px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                Configuration Ready
              </div>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl tracking-tight text-white sm:text-5xl">
                Your confirmation record is ready.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {order?.customer.fullName
                  ? `${order.customer.fullName}, your ${order.productName} order is confirmed and the post-purchase packet is ready below.`
                  : 'Your order is confirmed and the post-purchase packet is ready below.'}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Live Status
              </p>
              <p className="mt-3 text-3xl tracking-tight text-white">
                {status === 'FULFILLED' ? 'Confirmed' : status}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Keep this page for reference while fulfillment and shipping updates continue by email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_320px] lg:py-14">
        <section className="space-y-10">
          <div className="border-b border-white/10 pb-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Primary Reference
                </p>
                <code className="mt-4 block break-all font-mono text-2xl font-semibold tracking-[0.14em] text-white sm:text-3xl">
                  {referenceCode}
                </code>
              </div>

              <button
                type="button"
                onClick={handleCopyReference}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10"
              >
                {copied ? 'Copied' : 'Copy reference'}
              </button>
            </div>
          </div>

          <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Configuration Path
              </p>
              <div className="mt-6 space-y-6">
                {setupSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-sm font-semibold text-slate-100">
                        {index + 1}
                      </div>
                      {index < setupSteps.length - 1 && (
                        <div className="mt-2 h-full w-px bg-white/10" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h2 className="text-lg font-semibold text-white">{step.title}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Support
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Need to correct customer details or ask about fulfillment timing?
              </p>
              <a
                href="mailto:support@usdccoin.shop"
                className="mt-4 inline-flex text-sm font-semibold text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-sky-100"
              >
                support@usdccoin.shop
              </a>
            </div>
          </div>

          <div className="grid gap-8 border-b border-white/10 pb-10 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Order Packet
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-4">
                  <dt className="text-slate-500">Product</dt>
                  <dd className="text-right font-medium text-white">{order?.productName ?? 'Physical USDC Coin'}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-4">
                  <dt className="text-slate-500">Customer</dt>
                  <dd className="text-right font-medium text-white">{order?.customer.fullName ?? 'Pending'}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-4">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="text-right font-medium text-white">{order?.customer.email ?? 'Pending'}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-4">
                  <dt className="text-slate-500">Placed on</dt>
                  <dd className="text-right font-medium text-white">{order ? formatDate(order.createdAt) : 'Pending'}</dd>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <dt className="text-slate-500">Total</dt>
                  <dd className="text-right font-medium text-white">
                    {order ? formatCurrency(order.totalAmount, order.currency) : '$99.00'}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Record Keeping
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                <li>Order ID: <span className="font-medium text-white">{orderId}</span></li>
                <li>Reference code: <span className="font-medium text-white">{referenceCode}</span></li>
                <li>Status updates continue from this point by email rather than on the checkout screen.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/">
              <Button variant="secondary">Back to home</Button>
            </Link>
            <a href="mailto:support@usdccoin.shop">
              <Button variant="ghost">Contact support</Button>
            </a>
          </div>
        </section>

        <aside className="border-t border-white/10 pt-8 lg:pt-0">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Configuration Notes
            </p>
            <div className="mt-5 space-y-6 text-sm leading-7 text-slate-300">
              <div>
                <h2 className="font-semibold text-white">Confirmation complete</h2>
                <p className="mt-2">
                  Payment has cleared and the configuration record for this order has been generated.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-white">Next communication</h2>
                <p className="mt-2">
                  The next update will be delivered to your inbox once fulfillment advances or if support needs clarification.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-white">Keep this reference</h2>
                <p className="mt-2">
                  Sharing the reference code is the fastest way for support to locate and review this purchase.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
