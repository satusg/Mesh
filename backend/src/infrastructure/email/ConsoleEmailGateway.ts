import { IEmailGateway } from '../../application/ports/gateways/IEmailGateway'
import { Email } from '../../domain/customer/Email'
import { Order } from '../../domain/order/Order'

/**
 * Development email adapter — logs to console instead of sending.
 * Replace with a Resend / SendGrid / SES adapter in production.
 */
export class ConsoleEmailGateway implements IEmailGateway {
  async sendOrderConfirmation(to: Email, order: Order, licenseKey: string): Promise<void> {
    console.log(`[Backend] ${'─'.repeat(60)}`)
    console.log(`[Backend] [Email] Order confirmation -> ${to.value}`)
    console.log(`[Backend]   Order ID:    ${order.orderId.value}`)
    console.log(`[Backend]   Product:     ${order.product.name}`)
    console.log(`[Backend]   Amount:      $${order.total.formatted} ${order.total.currency}`)
    console.log(`[Backend]   License key: ${licenseKey}`)
    console.log(`[Backend] ${'─'.repeat(60)}`)
  }
}
