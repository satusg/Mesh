// ─── Domain-aligned types shared across the frontend ─────────────────────────

export type PaymentMethod =  'MESH'

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'FULFILLED'
  | 'FAILED'

export interface Product {
  productId: string
  name: string
  tagline: string
  description: string
  price: number      // cents
  currency: string
  features: string[]
}

export interface CreateOrderRequest {
  productId: string
  customer: {
    email: string
    fullName: string
  }
}

export interface CreateOrderResponse {
  orderId: string
  totalAmount: number
  currency: string
  productName: string
}

export interface InitiatePaymentRequest {
  method: PaymentMethod
}

export interface InitiatePaymentResponse {
  linkToken?: string        // Mesh Connect
  gatewayReference: string
}

export interface OrderView {
  orderId: string
  status: OrderStatus
  productName: string
  totalAmount: number
  currency: string
  customer: { email: string; fullName: string }
  licenseKey?: string
  createdAt: string
}

// ─── Checkout flow state ──────────────────────────────────────────────────────

export interface CustomerFormValues {
  email: string
  fullName: string
}
