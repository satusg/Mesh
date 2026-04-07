import { UniqueEntityId } from '../shared/UniqueEntityId'

export class PaymentId extends UniqueEntityId {
  static create(value?: string): PaymentId {
    return new PaymentId(value)
  }
}
