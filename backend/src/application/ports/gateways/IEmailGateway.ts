import { Email } from '../../../domain/customer/Email'
import { Order } from '../../../domain/order/Order'

export interface IEmailGateway {
  sendOrderConfirmation(to: Email, order: Order, licenseKey: string): Promise<void>
}
