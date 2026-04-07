import { useEffect, useState } from 'react'
import { useCheckout } from '@/hooks/useCheckout'
import { CustomerForm } from './CustomerForm'
import { OrderSummary } from './OrderSummary'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { MeshPayButton } from './MeshPayButton'
import { Spinner } from '@/components/ui/Spinner'
import type { PaymentMethod } from '@/types'

const PRODUCT = {
  productName: 'MeshPro',
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
    setPaymentMethod,
    setError,
  } = useCheckout()

  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
    if (orderId) initiatePayment(method)
  }

  // Initiate with the default method only once after the order is created,
  // but only if no payment has been initiated yet for this session
  useEffect(() => {
    if (orderId && !meshLinkToken) {
      initiatePayment(selectedMethod)
    }
  }, [orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    if (orderId) pollOrderStatus(orderId)
  }


  // ─── Step 1: Customer details ─────────────────────────────────────────────
  if (!orderId) {
    return (
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CustomerForm onSubmit={submitCustomerDetails} isLoading={isLoading} />
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <div className="lg:col-span-2">
          <OrderSummary {...PRODUCT} />
        </div>
      </div>
    )
  }

  // ─── Polling / processing ─────────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Spinner size="lg" label="Processing your payment…" />
        <p className="font-medium text-gray-900">Payment confirmed!</p>
        <p className="text-sm text-gray-500">Generating your license key, please wait…</p>
      </div>
    )
  }

  // ─── Step 2: Payment ──────────────────────────────────────────────────────
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <PaymentMethodSelector selected={selectedMethod} onChange={handleMethodChange} />

        {error && (
          <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner label="Preparing payment…" />
          </div>
        )}

        {/* Mesh Connect — crypto one-click payment */}
        {!isLoading && selectedMethod === 'MESH' && meshLinkToken && (
          <MeshPayButton
            linkToken={meshLinkToken}
            onSuccess={handlePaymentSuccess}
            onError={(msg) => setError(msg)}
          />
        )}
      </div>

      <div className="lg:col-span-2">
        <OrderSummary {...PRODUCT} />
      </div>
    </div>
  )
}
