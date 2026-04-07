import { UniqueEntityId } from '../shared/UniqueEntityId'

export class OrderId extends UniqueEntityId {
  static create(value?: string): OrderId {
    return new OrderId(value)
  }
}
