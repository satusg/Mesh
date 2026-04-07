import { AggregateRoot } from '../shared/AggregateRoot'
import { OrderId } from './OrderId'
import { OrderStatus } from './OrderStatus'
import { Customer } from '../customer/Customer'
import { Product } from '../product/Product'
import { Payment } from '../payment/Payment'
import { Money } from '../payment/Money'
import { OrderPaidEvent, OrderFulfilledEvent } from '../shared/DomainEvent'

interface OrderProps {
  orderId: OrderId
  customer: Customer
  product: Product
  status: OrderStatus
  payment?: Payment
  licenseKey?: string
  createdAt: Date
}

export class Order extends AggregateRoot {
  private _status: OrderStatus
  private _payment?: Payment
  private _licenseKey?: string

  private constructor(private readonly props: OrderProps) {
    super(props.orderId)
    this._status    = props.status
    this._payment   = props.payment
    this._licenseKey = props.licenseKey
  }

  // ─── Factory ────────────────────────────────────────────────────────────────

  static create(customer: Customer, product: Product): Order {
    return new Order({
      orderId: OrderId.create(),
      customer,
      product,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
    })
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props)
  }

  // ─── Queries ─────────────────────────────────────────────────────────────────

  get orderId(): OrderId         { return this.props.orderId }
  get customer(): Customer       { return this.props.customer }
  get product(): Product         { return this.props.product }
  get status(): OrderStatus      { return this._status }
  get payment(): Payment | undefined  { return this._payment }
  get licenseKey(): string | undefined { return this._licenseKey }
  get createdAt(): Date          { return this.props.createdAt }
  get total(): Money             { return this.props.product.price }

  // ─── State transitions ────────────────────────────────────────────────────

  initiatePayment(payment: Payment): void {
    if (this._status !== OrderStatus.PENDING && this._status !== OrderStatus.AWAITING_PAYMENT) {
      throw new Error(
        `Cannot perform 'initiatePayment' on order with status '${this._status}'. Expected 'PENDING' or 'AWAITING_PAYMENT'.`,
      )
    }
    this._payment = payment
    this._status  = OrderStatus.AWAITING_PAYMENT
  }

  confirmPayment(): void {
    this.assertStatus(OrderStatus.AWAITING_PAYMENT, 'confirmPayment')
    if (!this._payment) throw new Error('No payment attached to order')
    this._payment.markSucceeded()
    this._status = OrderStatus.PAID
    this.addDomainEvent(new OrderPaidEvent(this.orderId.value))
  }

  fulfill(licenseKey: string): void {
    this.assertStatus(OrderStatus.PAID, 'fulfill')
    this._licenseKey = licenseKey
    this._status     = OrderStatus.FULFILLED
    this.addDomainEvent(new OrderFulfilledEvent(this.orderId.value, licenseKey))
  }

  failPayment(): void {
    if (this._payment) this._payment.markFailed()
    this._status = OrderStatus.FAILED
  }

  private assertStatus(expected: OrderStatus, operation: string): void {
    if (this._status !== expected) {
      throw new Error(
        `Cannot perform '${operation}' on order with status '${this._status}'. Expected '${expected}'.`,
      )
    }
  }
}
