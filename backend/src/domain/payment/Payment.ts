import { PaymentId } from './PaymentId'
import { PaymentMethod } from './PaymentMethod'
import { PaymentStatus } from './PaymentStatus'
import { Money } from './Money'

interface PaymentProps {
  paymentId: PaymentId
  method: PaymentMethod
  amount: Money
  status: PaymentStatus
  gatewayReference: string
  paidAt?: Date
}

export class Payment {
  private _status: PaymentStatus
  private _paidAt?: Date

  private constructor(private readonly props: PaymentProps) {
    this._status = props.status
    this._paidAt = props.paidAt
  }

  static create(props: Omit<PaymentProps, 'status' | 'paidAt'>): Payment {
    return new Payment({ ...props, status: PaymentStatus.PENDING })
  }

  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props)
  }

  get paymentId(): PaymentId  { return this.props.paymentId }
  get method(): PaymentMethod { return this.props.method }
  get amount(): Money         { return this.props.amount }
  get gatewayReference(): string { return this.props.gatewayReference }
  get status(): PaymentStatus { return this._status }
  get paidAt(): Date | undefined { return this._paidAt }

  markSucceeded(): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error(`Cannot mark succeeded from status ${this._status}`)
    }
    this._status = PaymentStatus.SUCCEEDED
    this._paidAt = new Date()
  }

  markFailed(): void {
    this._status = PaymentStatus.FAILED
  }
}
