export interface CreateOrderResult {
  orderId: string
  totalAmount: number   // cents
  currency: string
  productName: string
}
