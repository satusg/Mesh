import { useEffect, useState } from 'react'
import { useCheckout } from '@/hooks/useCheckout'
import { CustomerForm } from './CustomerForm'
import { OrderSummary } from './OrderSummary'
import { MeshPayButton } from './MeshPayButton'
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
    pollOrderStatus,
    setError,
  } = useCheckout()

  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (orderId && !meshLinkToken) {
      initiatePayment(selectedMethod)
    }
  }, [orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    if (orderId) pollOrderStatus(orderId)
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Spinner size="lg" label="Processing your payment…" />
        <p className="font-medium text-gray-900">Payment received</p>
        <p className="text-sm text-gray-500">Finalizing your order confirmation…</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {orderId ? 'Payment' : 'Checkout'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {orderId
              ? 'Complete your order securely with crypto.'
              : 'Enter your details to continue.'}
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
          <MeshPayButton
            linkToken={meshLinkToken}
            onSuccess={handlePaymentSuccess}
            onError={(msg) => setError(msg)}
          />
        )}
      </div>

      <OrderSummary {...PRODUCT} />
    </div>
  )
}
