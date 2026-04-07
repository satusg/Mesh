import { UniqueEntityId } from '../shared/UniqueEntityId'

export class CustomerId extends UniqueEntityId {
  static create(value?: string): CustomerId {
    return new CustomerId(value)
  }
}
