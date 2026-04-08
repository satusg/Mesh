import { useEffect, useState } from 'react'
import { useCheckout } from '@/hooks/useCheckout'
import { CustomerForm } from './CustomerForm'
import { OrderSummary } from './OrderSummary'
import { MeshPayButton } from './MeshPayButton'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { Spinner } from '@/components/ui/Spinner'

const PRODUCT = {
  productName: 'Physical USDC Coin',
  price:       9900,
  currency:    'USD',
}

export function CheckoutForm() {
  const {
    orderId,
    selectedMethod,
    meshLinkToken,
    isLoading,
    error,
    submitCustomerDetails,
    initiatePayment,
    finalizePayment,
    setPaymentMethod,
    setError,
  } = useCheckout()

  const [isFinalizing, setIsFinalizing] = useState(false)

  useEffect(() => {
    if (orderId && !meshLinkToken) {
      initiatePayment(selectedMethod)
    }
  }, [orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsFinalizing(false)
  }, [orderId])

  const handlePaymentSuccess = async () => {
    if (!orderId) {
      setError('Order not found. Please restart checkout.')
      return
    }

    setIsFinalizing(true)
    await finalizePayment()
  }

  if (isFinalizing) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Spinner size="lg" label="Processing your payment…" />
        <p className="font-medium text-white">Payment received</p>
        <p className="text-sm text-slate-400">Finalizing your order confirmation…</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl text-white">
            {orderId ? 'Pay with crypto' : 'Checkout'}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {orderId
              ? 'Connect a trusted exchange or wallet through Mesh’s embedded checkout flow. No manual address copy or QR step required.'
              : 'Enter your details to continue to a crypto payment flow powered by trusted exchanges and wallets.'}
          </p>
          {orderId && (
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-slate-300">Smart Pay</span>
              <span>Coinbase</span>
              <span>Binance</span>
              <span>MetaMask</span>
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-3xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {!orderId && (
          <CustomerForm onSubmit={submitCustomerDetails} isLoading={isLoading} />
        )}

        {orderId && isLoading && (
          <div className="flex justify-center py-8">
            <Spinner label="Preparing payment…" />
          </div>
        )}

        {orderId && !isLoading && meshLinkToken && (
          <div className="space-y-6">
            <PaymentMethodSelector
              selected={selectedMethod}
              onChange={setPaymentMethod}
            />

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Recommended
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">Pay with Crypto</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Mesh securely connects your exchange or wallet once, lets you preview the transfer, and keeps the payment flow inside the page.
              </p>

              <div className="mt-6">
                <MeshPayButton
                  linkToken={meshLinkToken}
                  orderId={orderId}
                  onSuccess={handlePaymentSuccess}
                  onError={(msg) => setError(msg)}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>No manual wallet address copy and paste.</p>
                <p>SmartFunding may help complete payment when supported.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderSummary {...PRODUCT} />
    </div>
  )
}
