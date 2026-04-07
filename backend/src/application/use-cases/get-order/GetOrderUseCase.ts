import { IOrderRepository } from '../../ports/repositories/IOrderRepository'
import { GetOrderQuery } from './GetOrderQuery'
import { OrderId } from '../../../domain/order/OrderId'
import { Order } from '../../../domain/order/Order'

export interface OrderView {
  orderId: string
  status: string
  productName: string
  totalAmount: number
  currency: string
  customer: { email: string; fullName: string }
  licenseKey?: string
  createdAt: string
}

function toView(order: Order): OrderView {
  return {
    orderId:     order.orderId.value,
    status:      order.status,
    productName: order.product.name,
    totalAmount: order.total.amount,
    currency:    order.total.currency,
    customer: {
      email:    order.customer.email.value,
      fullName: order.customer.fullName,
    },
    licenseKey: order.licenseKey,
    createdAt:  order.createdAt.toISOString(),
  }
}

export class GetOrderUseCase {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(query: GetOrderQuery): Promise<OrderView> {
    const order = await this.orderRepo.findById(OrderId.create(query.orderId))
    if (!order) throw new Error(`Order not found: ${query.orderId}`)
    return toView(order)
  }
}
