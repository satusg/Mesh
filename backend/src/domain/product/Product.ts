import { ProductId } from './ProductId'
import { Money } from '../payment/Money'

interface ProductProps {
  productId: ProductId
  name: string
  tagline: string
  description: string
  price: Money
  features: string[]
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(props: ProductProps): Product {
    if (!props.name.trim()) throw new Error('Product name is required')
    return new Product(props)
  }

  get productId(): ProductId     { return this.props.productId }
  get name(): string             { return this.props.name }
  get tagline(): string          { return this.props.tagline }
  get description(): string      { return this.props.description }
  get price(): Money             { return this.props.price }
  get features(): string[]       { return [...this.props.features] }
}
