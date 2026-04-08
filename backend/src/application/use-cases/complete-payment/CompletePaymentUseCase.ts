import { IOrderRepository } from '../../ports/repositories/IOrderRepository'
import { CompletePaymentCommand } from './CompletePaymentCommand'
import { OrderId } from '../../../domain/order/OrderId'
import { OrderStatus } from '../../../domain/order/OrderStatus'
import { generateLicenseKey } from '../../../infrastructure/license/licenseService'
import { ApplicationError } from '../../errors'

export class CompletePaymentUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly licenseSecret: string,
    private readonly enabled: boolean,
  ) {}

  async execute(command: CompletePaymentCommand): Promise<void> {
    if (!this.enabled) {
      throw new ApplicationError(
        'CLIENT_PAYMENT_CONFIRMATION_DISABLED',
        'Client-side payment confirmation is disabled.',
        403,
      )
    }

    const order = await this.orderRepo.findById(OrderId.create(command.orderId))
    if (!order) {
      throw new ApplicationError('ORDER_NOT_FOUND', `Order not found: ${command.orderId}`, 404)
    }

    if (order.payment?.gatewayReference !== command.gatewayReference) {
      throw new ApplicationError('INVALID_GATEWAY_REFERENCE', 'Gateway reference does not match the order.', 400)
    }

    if (order.status === OrderStatus.FULFILLED) return
    if (order.status !== OrderStatus.AWAITING_PAYMENT) {
      throw new ApplicationError(
        'INVALID_ORDER_STATUS',
        `Order cannot be completed from status '${order.status}'.`,
        409,
      )
    }

    order.confirmPayment()
    const licenseKey = generateLicenseKey(order.orderId.value, this.licenseSecret)
    order.fulfill(licenseKey)
    await this.orderRepo.save(order)
  }
}
