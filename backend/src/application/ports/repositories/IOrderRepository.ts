import { Order } from '../../../domain/order/Order'
import { OrderId } from '../../../domain/order/OrderId'

export interface IOrderRepository {
  save(order: Order): Promise<void>
  findById(id: OrderId): Promise<Order | null>
  findByGatewayReference(gatewayRef: string): Promise<Order | null>
}
