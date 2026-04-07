import axios from 'axios'
import type {
  Product,
  CreateOrderRequest,
  CreateOrderResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  OrderView,
} from '@/types'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
})

// Normalise error messages from the API error envelope
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const apiMessage = err?.response?.data?.error?.message
    if (apiMessage) err.message = apiMessage
    return Promise.reject(err)
  },
)

export const api = {
  getProduct(): Promise<Product> {
    return http.get<Product>('/api/products/meshpro').then((r) => r.data)
  },

  createOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
    return http.post<CreateOrderResponse>('/api/orders', body).then((r) => r.data)
  },

  initiatePayment(orderId: string, body: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    return http
      .post<InitiatePaymentResponse>(`/api/orders/${orderId}/payment`, body)
      .then((r) => r.data)
  },

  getOrder(orderId: string): Promise<OrderView> {
    return http.get<OrderView>(`/api/orders/${orderId}`).then((r) => r.data)
  },
}
