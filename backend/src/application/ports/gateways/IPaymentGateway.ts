import { Order } from '../../../domain/order/Order'
import { PaymentMethod } from '../../../domain/payment/PaymentMethod'
import { PaymentStatus } from '../../../domain/payment/PaymentStatus'
import { Money } from '../../../domain/payment/Money'

export interface PaymentInitResult {
  gatewayReference: string
  /** Mesh only — short-lived one-time token passed to openLink() on the frontend */
  linkToken?: string
}

export interface WebhookEvent {
  type: 'payment.succeeded' | 'payment.failed'
  gatewayReference: string
}

export interface IPaymentGateway {
  readonly supportedMethod: PaymentMethod

  /** Create a payment intent / order in the gateway and return init data */
  createPaymentIntent(order: Order): Promise<PaymentInitResult>

  /** Capture or confirm a previously created payment (not used by mesh) */
  capturePayment(gatewayReference: string): Promise<PaymentStatus>

  /** Issue a full refund */
  refund(gatewayReference: string, amount: Money): Promise<void>

  /** Verify the webhook signature — throws if invalid */
  verifyWebhookSignature(payload: Buffer, signature: string): void

  /** Parse a raw webhook payload into a normalised event */
  parseWebhookEvent(payload: Buffer): Promise<WebhookEvent>
}
