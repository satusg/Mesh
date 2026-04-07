import { IEmailGateway } from '../../application/ports/gateways/IEmailGateway'
import { Email } from '../../domain/customer/Email'
import { Order } from '../../domain/order/Order'

/**
 * Development email adapter — logs to console instead of sending.
 * Replace with a Resend / SendGrid / SES adapter in production.
 */
export class ConsoleEmailGateway implements IEmailGateway {
  async sendOrderConfirmation(to: Email, order: Order, licenseKey: string): Promise<void> {
    console.log('─'.repeat(60))
    console.log(`[Email] Order confirmation → ${to.value}`)
    console.log(`  Order ID:    ${order.orderId.value}`)
    console.log(`  Product:     ${order.product.name}`)
    console.log(`  Amount:      $${order.total.formatted} ${order.total.currency}`)
    console.log(`  License key: ${licenseKey}`)
    console.log('─'.repeat(60))
  }
}
