export interface CreateOrderCommand {
  productId: string
  customer: {
    email: string
    fullName: string
  }
}
