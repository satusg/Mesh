import { PaymentMethod } from '../../../domain/payment/PaymentMethod'

export interface InitiatePaymentCommand {
  orderId: string
  method: PaymentMethod
}
