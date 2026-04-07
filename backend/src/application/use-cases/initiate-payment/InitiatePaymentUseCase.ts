import { IOrderRepository } from '../../ports/repositories/IOrderRepository'
import { IPaymentGateway } from '../../ports/gateways/IPaymentGateway'
import { InitiatePaymentCommand } from './InitiatePaymentCommand'
import { InitiatePaymentResult } from './InitiatePaymentResult'
import { OrderId } from '../../../domain/order/OrderId'
import { Payment } from '../../../domain/payment/Payment'
import { PaymentId } from '../../../domain/payment/PaymentId'
import { PaymentMethod } from '../../../domain/payment/PaymentMethod'
import { ApplicationError } from '../../errors'

export class InitiatePaymentUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly gateways: Map<PaymentMethod, IPaymentGateway>,
  ) {}

  async execute(command: InitiatePaymentCommand): Promise<InitiatePaymentResult> {
    const order = await this.orderRepo.findById(OrderId.create(command.orderId))
    if (!order) throw new ApplicationError('ORDER_NOT_FOUND', `Order not found: ${command.orderId}`, 404)

    const gateway = this.gateways.get(command.method)
    if (!gateway) throw new ApplicationError('UNSUPPORTED_PAYMENT_METHOD', `No gateway for method: ${command.method}`, 400)

    let initResult
    try {
      initResult = await gateway.createPaymentIntent(order)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment gateway error'
      throw new ApplicationError('PAYMENT_GATEWAY_ERROR', message, 502)
    }

    const payment = Payment.create({
      paymentId:        PaymentId.create(),
      method:           command.method,
      amount:           order.total,
      gatewayReference: initResult.gatewayReference,
    })

    order.initiatePayment(payment)
    await this.orderRepo.save(order)

    return {
      linkToken:        initResult.linkToken,
      gatewayReference: initResult.gatewayReference,
    }
  }
}
