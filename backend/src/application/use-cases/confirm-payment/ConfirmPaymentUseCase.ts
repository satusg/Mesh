import { IOrderRepository } from '../../ports/repositories/IOrderRepository'
import { IPaymentGateway } from '../../ports/gateways/IPaymentGateway'
import { IEmailGateway } from '../../ports/gateways/IEmailGateway'
import { ConfirmPaymentCommand } from './ConfirmPaymentCommand'
import { PaymentMethod } from '../../../domain/payment/PaymentMethod'
import { OrderStatus } from '../../../domain/order/OrderStatus'
import { generateLicenseKey } from '../../../infrastructure/license/licenseService'

export class ConfirmPaymentUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly gateways: Map<PaymentMethod, IPaymentGateway>,
    private readonly emailGateway: IEmailGateway,
    private readonly licenseSecret: string,
  ) {}

  async execute(command: ConfirmPaymentCommand): Promise<void> {
    const gateway = this.resolveGateway(command.gatewayType)

    // Verify signature — throws on tampered payload
    gateway.verifyWebhookSignature(command.rawPayload, command.signature)

    const event = await gateway.parseWebhookEvent(command.rawPayload)

    const order = await this.orderRepo.findByGatewayReference(event.gatewayReference)
    if (!order) return // Unknown reference — possibly a test event; silently ack

    if (event.type === 'payment.succeeded') {
      if (order.status !== OrderStatus.AWAITING_PAYMENT) return // idempotency

      order.confirmPayment()

      const licenseKey = generateLicenseKey(order.orderId.value, this.licenseSecret)
      order.fulfill(licenseKey)

      await this.orderRepo.save(order)

      this.emailGateway
        .sendOrderConfirmation(order.customer.email, order, licenseKey)
        .catch((err) => console.error('[EmailGateway] Failed to send confirmation:', err))

    } else if (event.type === 'payment.failed') {
      if (order.status === OrderStatus.FAILED) return
      order.failPayment()
      await this.orderRepo.save(order)
    }
  }

  private resolveGateway(type: 'mesh'): IPaymentGateway {
    const methodMap: Record<typeof type, PaymentMethod> = {
      mesh:   PaymentMethod.MESH,
    }
    const gateway = this.gateways.get(methodMap[type])
    if (!gateway) throw new Error(`No gateway registered for type: ${type}`)
    return gateway
  }
}
