import Database from 'better-sqlite3'
import { IOrderRepository } from '../../../application/ports/repositories/IOrderRepository'
import { Order } from '../../../domain/order/Order'
import { OrderId } from '../../../domain/order/OrderId'
import { OrderStatus } from '../../../domain/order/OrderStatus'
import { Customer } from '../../../domain/customer/Customer'
import { CustomerId } from '../../../domain/customer/CustomerId'
import { Email } from '../../../domain/customer/Email'
import { Product } from '../../../domain/product/Product'
import { ProductId } from '../../../domain/product/ProductId'
import { Payment } from '../../../domain/payment/Payment'
import { PaymentId } from '../../../domain/payment/PaymentId'
import { PaymentMethod } from '../../../domain/payment/PaymentMethod'
import { PaymentStatus } from '../../../domain/payment/PaymentStatus'
import { Money } from '../../../domain/payment/Money'

interface OrderRow {
  id: string
  customer_id: string
  customer_email: string
  customer_name: string
  product_id: string
  product_name: string
  product_price: number
  currency: string
  status: string
  license_key: string | null
  created_at: string
}

interface PaymentRow {
  id: string
  order_id: string
  method: string
  amount: number
  currency: string
  status: string
  gateway_reference: string | null
  paid_at: string | null
}

export class SqliteOrderRepository implements IOrderRepository {
  constructor(private readonly db: Database.Database) {}

  async save(order: Order): Promise<void> {
    const upsertOrder = this.db.prepare(`
      INSERT INTO orders (id, customer_id, customer_email, customer_name, product_id, product_name, product_price, currency, status, license_key, created_at)
      VALUES (@id, @customer_id, @customer_email, @customer_name, @product_id, @product_name, @product_price, @currency, @status, @license_key, @created_at)
      ON CONFLICT(id) DO UPDATE SET
        status = @status,
        license_key = @license_key
    `)

    const upsertPayment = this.db.prepare(`
      INSERT INTO payments (id, order_id, method, amount, currency, status, gateway_reference, paid_at)
      VALUES (@id, @order_id, @method, @amount, @currency, @status, @gateway_reference, @paid_at)
      ON CONFLICT(id) DO UPDATE SET
        status = @status,
        gateway_reference = @gateway_reference,
        paid_at = @paid_at
    `)

    const checkExists = this.db.prepare('SELECT 1 FROM orders WHERE id = ?')

    const insertEvent = this.db.prepare(`
      INSERT INTO order_events (order_id, event_type, detail)
      VALUES (@order_id, @event_type, @detail)
    `)

    const txn = this.db.transaction(() => {
      const isNew = !checkExists.get(order.orderId.value)

      upsertOrder.run({
        id: order.orderId.value,
        customer_id: order.customer.customerId.value,
        customer_email: order.customer.email.toString(),
        customer_name: order.customer.fullName,
        product_id: order.product.productId.value,
        product_name: order.product.name,
        product_price: order.product.price.amount,
        currency: order.product.price.currency,
        status: order.status,
        license_key: order.licenseKey ?? null,
        created_at: order.createdAt.toISOString(),
      })

      if (order.payment) {
        upsertPayment.run({
          id: order.payment.paymentId.value,
          order_id: order.orderId.value,
          method: order.payment.method,
          amount: order.payment.amount.amount,
          currency: order.payment.amount.currency,
          status: order.payment.status,
          gateway_reference: order.payment.gatewayReference ?? null,
          paid_at: order.payment.paidAt?.toISOString() ?? null,
        })
      }

      // Log creation event on first insert
      if (isNew) {
        insertEvent.run({
          order_id: order.orderId.value,
          event_type: 'OrderCreated',
          detail: JSON.stringify({
            customerId: order.customer.customerId.value,
            email: order.customer.email.toString(),
            customerName: order.customer.fullName,
            productId: order.product.productId.value,
            productName: order.product.name,
            amount: order.product.price.amount,
            currency: order.product.price.currency,
          }),
        })
      }

      // Log status change
      insertEvent.run({
        order_id: order.orderId.value,
        event_type: `StatusChanged:${order.status}`,
        detail: JSON.stringify({ status: order.status }),
      })

      // Flush domain events into the event log
      for (const event of order.pullDomainEvents()) {
        insertEvent.run({
          order_id: order.orderId.value,
          event_type: event.eventName,
          detail: JSON.stringify(event),
        })
      }
    })

    txn()
  }

  async findById(id: OrderId): Promise<Order | null> {
    const row = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(id.value) as OrderRow | undefined
    if (!row) return null
    return this.reconstitute(row)
  }

  async findByGatewayReference(gatewayRef: string): Promise<Order | null> {
    const paymentRow = this.db.prepare(
      'SELECT order_id FROM payments WHERE gateway_reference = ?',
    ).get(gatewayRef) as { order_id: string } | undefined
    if (!paymentRow) return null
    return this.findById(OrderId.create(paymentRow.order_id))
  }

  private reconstitute(row: OrderRow): Order {
    const customer = Customer.reconstitute({
      customerId: new CustomerId(row.customer_id),
      email: Email.create(row.customer_email),
      fullName: row.customer_name,
    })

    const product = Product.reconstitute({
      productId: new ProductId(row.product_id),
      name: row.product_name,
      tagline: '',
      description: '',
      price: Money.of(row.product_price, row.currency),
      features: [],
    })

    const paymentRow = this.db.prepare(
      'SELECT * FROM payments WHERE order_id = ?',
    ).get(row.id) as PaymentRow | undefined

    let payment: Payment | undefined
    if (paymentRow) {
      payment = Payment.reconstitute({
        paymentId: new PaymentId(paymentRow.id),
        method: paymentRow.method as PaymentMethod,
        amount: Money.of(paymentRow.amount, paymentRow.currency),
        status: paymentRow.status as PaymentStatus,
        gatewayReference: paymentRow.gateway_reference ?? '',
        paidAt: paymentRow.paid_at ? new Date(paymentRow.paid_at) : undefined,
      })
    }

    return Order.reconstitute({
      orderId: OrderId.create(row.id),
      customer,
      product,
      status: row.status as OrderStatus,
      payment,
      licenseKey: row.license_key ?? undefined,
      createdAt: new Date(row.created_at),
    })
  }
}
