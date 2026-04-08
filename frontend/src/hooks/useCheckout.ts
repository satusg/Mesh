import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckoutStore } from '@/store/checkoutStore'
import { api } from '@/services/api'
import type { CustomerFormValues, OrderView, PaymentMethod } from '@/types'

const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID ?? 'a1b2c3d4-0000-0000-0000-000000000001'
const POLL_INTERVAL_MS  = 2000
const POLL_MAX_ATTEMPTS = 30

export function useCheckout() {
  const store    = useCheckoutStore()
  const navigate = useNavigate()

  const submitCustomerDetails = useCallback(
    async (values: CustomerFormValues) => {
      store.setLoading(true)
      store.setError(null)
      try {
        const result = await api.createOrder({
          productId: PRODUCT_ID,
          customer:  { email: values.email, fullName: values.fullName },
        })
        store.setOrderCreated(result.orderId, PRODUCT_ID, values.email, values.fullName)
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Failed to create order')
      } finally {
        store.setLoading(false)
      }
    },
    [store],
  )

  const initiatePayment = useCallback(
    async (method: PaymentMethod) => {
      if (!store.orderId) return
      store.setLoading(true)
      store.setError(null)
      try {
        const result = await api.initiatePayment(store.orderId, { method })
        store.setPaymentInitiated(result.linkToken, result.gatewayReference)
      } catch (err) {
        store.setError(err instanceof Error ? err.message : 'Failed to initiate payment')
      } finally {
        store.setLoading(false)
      }
    },
    [store],
  )

  const finalizePayment = useCallback(
    async () => {
      if (!store.orderId) return

      const { orderId, gatewayReference } = store
      store.setLoading(true)
      store.setError(null)

      if (gatewayReference) {
        try {
          await api.completePayment(orderId, { gatewayReference })
        } catch (err) {
          console.warn('[Checkout] Client-side payment completion failed; falling back to order polling.', err)
        }
      }

      try {
        const order = await api.getOrder(orderId)
        store.setOrderStatus(order.status, order.licenseKey)
      } catch (err) {
        console.warn('[Checkout] Failed to fetch finalized order state before redirect.', err)
      } finally {
        store.setLoading(false)
        navigate(`/confirmation/${orderId}`)
      }
    },
    [store, navigate],
  )

  const pollOrderStatus = useCallback(
    (orderId: string) => {
      let attempts = 0
      const interval = setInterval(async () => {
        attempts++
        try {
          const order = await api.getOrder(orderId)
          store.setOrderStatus(order.status, order.licenseKey)

          if (order.status === 'FULFILLED') {
            clearInterval(interval)
            navigate(`/confirmation/${orderId}`)
          } else if (order.status === 'FAILED' || attempts >= POLL_MAX_ATTEMPTS) {
            clearInterval(interval)
            if (order.status === 'FAILED') store.setError('Payment failed. Please try again.')
            if (attempts >= POLL_MAX_ATTEMPTS && order.status !== 'FAILED') {
              store.setError('Payment received, but final confirmation is still pending. Please wait a moment and refresh.')
            }
          }
        } catch {
          // Network hiccup — keep polling
        }
      }, POLL_INTERVAL_MS)

      return () => clearInterval(interval)
    },
    [store, navigate],
  )

  return {
    ...store,
    submitCustomerDetails,
    initiatePayment,
    finalizePayment,
    pollOrderStatus,
  }
}

export function useOrderPolling(orderId: string | undefined) {
  const store    = useCheckoutStore()
  const [order, setOrder] = useState<OrderView | null>(null)

  useEffect(() => {
    if (!orderId) return

    api.getOrder(orderId).then((order) => {
      setOrder(order)
      store.setOrderStatus(order.status, order.licenseKey)
    }).catch(() => {})

    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const order = await api.getOrder(orderId)
        setOrder(order)
        store.setOrderStatus(order.status, order.licenseKey)
        if (order.status === 'FULFILLED' || order.status === 'FAILED' || attempts >= POLL_MAX_ATTEMPTS) {
          clearInterval(interval)
        }
      } catch {
        if (attempts >= POLL_MAX_ATTEMPTS) clearInterval(interval)
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [orderId, store])

  return { order, status: store.orderStatus, licenseKey: store.licenseKey }
}
