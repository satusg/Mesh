import { IOrderRepository } from '../../application/ports/repositories/IOrderRepository'
import { Order } from '../../domain/order/Order'
import { OrderId } from '../../domain/order/OrderId'

/**
 * In-memory implementation of IOrderRepository.
 * Swap this for a Prisma/TypeORM adapter in production without touching any domain or application code.
 */
export class InMemoryOrderRepository implements IOrderRepository {
  private readonly store = new Map<string, Order>()

  async save(order: Order): Promise<void> {
    this.store.set(order.orderId.value, order)
  }

  async findById(id: OrderId): Promise<Order | null> {
    return this.store.get(id.value) ?? null
  }

  async findByGatewayReference(gatewayRef: string): Promise<Order | null> {
    for (const order of this.store.values()) {
      if (order.payment?.gatewayReference === gatewayRef) {
        return order
      }
    }
    return null
  }
}
