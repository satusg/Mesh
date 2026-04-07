import { UniqueEntityId } from '../shared/UniqueEntityId'

export class ProductId extends UniqueEntityId {
  static create(value?: string): ProductId {
    return new ProductId(value)
  }
}
