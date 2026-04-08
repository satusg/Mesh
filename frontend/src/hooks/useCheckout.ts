import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckoutStore } from '@/store/checkoutStore'
import { api } from '@/services/api'
import { frontendLogger } from '@/services/logger'
import type { CustomerFormValues, OrderStatus, OrderView, PaymentMethod } from '@/types'

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
        frontendLogger.info('Order created', result.orderId, {
          email: values.email,
          customerName: values.fullName,
          productId: PRODUCT_ID,
        })
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
        frontendLogger.info('Payment initiated', store.orderId, {
          method,
          gatewayReference: result.gatewayReference,
          hasLinkToken: Boolean(result.linkToken),
        })
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
          frontendLogger.info('Client-side payment completion requested', orderId, { gatewayReference })
        } catch (err) {
          frontendLogger.warn('Client-side payment completion failed; falling back to order polling.', orderId, {
            gatewayReference,
            error: err instanceof Error ? err.message : String(err),
          })
        }
      }

      try {
        const order = await api.getOrder(orderId)
        store.setOrderStatus(order.status, order.licenseKey)
      } catch (err) {
        frontendLogger.warn('Failed to fetch finalized order state before redirect.', orderId, {
          error: err instanceof Error ? err.message : String(err),
        })
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
  const [order, setOrder] = useState<OrderView | null>(null)
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!orderId) return

    let isActive = true
    let interval: ReturnType<typeof setInterval> | undefined

    const syncOrder = async () => {
      try {
        const nextOrder = await api.getOrder(orderId)
        if (!isActive) return null

        setOrder(nextOrder)
        setStatus(nextOrder.status)
        setLicenseKey(nextOrder.licenseKey ?? null)
        setError(null)
        setIsLoaded(true)
        return nextOrder
      } catch (err) {
        if (!isActive) return null

        setOrder(null)
        setStatus(null)
        setLicenseKey(null)
        setError(err instanceof Error ? err.message : 'Failed to load order confirmation')
        setIsLoaded(true)
        return null
      }
    }

    setOrder(null)
    setStatus(null)
    setLicenseKey(null)
    setError(null)
    setIsLoaded(false)

    void syncOrder().then((initialOrder) => {
      if (!initialOrder || initialOrder.status === 'FULFILLED' || initialOrder.status === 'FAILED') {
        return
      }

      let attempts = 0
      interval = setInterval(async () => {
        attempts++
        try {
          const nextOrder = await api.getOrder(orderId)
          if (!isActive) return

          setOrder(nextOrder)
          setStatus(nextOrder.status)
          setLicenseKey(nextOrder.licenseKey ?? null)
          setError(null)
          if (nextOrder.status === 'FULFILLED' || nextOrder.status === 'FAILED' || attempts >= POLL_MAX_ATTEMPTS) {
            clearInterval(interval)
          }
        } catch {
          if (attempts >= POLL_MAX_ATTEMPTS && interval) clearInterval(interval)
        }
      }, POLL_INTERVAL_MS)
    })

    return () => {
      isActive = false
      if (interval) clearInterval(interval)
    }
  }, [orderId])

  return { order, status, licenseKey, error, isLoaded }
}
