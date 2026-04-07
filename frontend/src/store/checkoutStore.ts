import { create } from 'zustand'
import type { PaymentMethod, OrderStatus } from '@/types'

interface CheckoutState {
  orderId: string | null
  productId: string | null
  customerEmail: string | null
  customerName: string | null

  selectedMethod: PaymentMethod
  meshLinkToken: string | null
  gatewayReference: string | null

  orderStatus: OrderStatus | null
  licenseKey: string | null

  isLoading: boolean
  error: string | null

  setOrderCreated(orderId: string, productId: string, email: string, name: string): void
  setPaymentMethod(method: PaymentMethod): void
  setPaymentInitiated( linkToken?: string, ref?: string): void
  setOrderStatus(status: OrderStatus, licenseKey?: string): void
  setLoading(loading: boolean): void
  setError(error: string | null): void
  reset(): void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  orderId:            null,
  productId:          null,
  customerEmail:      null,
  customerName:       null,
  selectedMethod:     'MESH',
  meshLinkToken:      null,
  gatewayReference:   null,
  orderStatus:        null,
  licenseKey:         null,
  isLoading:          false,
  error:              null,

  setOrderCreated: (orderId, productId, email, name) =>
    set({ orderId, productId, customerEmail: email, customerName: name, error: null }),

  setPaymentMethod: (method) =>
    set((state) => (
      state.selectedMethod === method
        ? { selectedMethod: method }
        : { selectedMethod: method, meshLinkToken: null }
    )),

  setPaymentInitiated: ( linkToken, ref) =>
    set({
      meshLinkToken:      linkToken    ?? null,
      gatewayReference:   ref          ?? null,
    }),

  setOrderStatus: (status, licenseKey) => set({ orderStatus: status, licenseKey: licenseKey ?? null }),

  setLoading: (isLoading) => set({ isLoading }),
  setError:   (error)     => set({ error, isLoading: false }),

  reset: () =>
    set({
      orderId: null, productId: null, customerEmail: null, customerName: null,
      selectedMethod: 'MESH',
      meshLinkToken: null, gatewayReference: null, orderStatus: null, licenseKey: null,
      isLoading: false, error: null,
    }),
}))
