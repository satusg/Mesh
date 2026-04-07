import { IOrderRepository } from '../../ports/repositories/IOrderRepository'
import { IProductRepository } from '../../ports/repositories/IProductRepository'
import { CreateOrderCommand } from './CreateOrderCommand'
import { CreateOrderResult } from './CreateOrderResult'
import { Customer } from '../../../domain/customer/Customer'
import { Order } from '../../../domain/order/Order'
import { ProductId } from '../../../domain/product/ProductId'

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<CreateOrderResult> {
    const productId = ProductId.create(command.productId)
    const product = await this.productRepo.findById(productId)
    if (!product) {
      throw new Error(`Product not found: ${command.productId}`)
    }

    const customer = Customer.create(command.customer.email, command.customer.fullName)
    const order    = Order.create(customer, product)

    await this.orderRepo.save(order)

    return {
      orderId:     order.orderId.value,
      totalAmount: order.total.amount,
      currency:    order.total.currency,
      productName: product.name,
    }
  }
}
