import { IProductRepository } from '../../application/ports/repositories/IProductRepository'
import { Product } from '../../domain/product/Product'
import { ProductId } from '../../domain/product/ProductId'
import { Money } from '../../domain/payment/Money'

/** The single product offered — seeded once at startup. */
export const MESHPRO_PRODUCT_ID = 'a1b2c3d4-0000-0000-0000-000000000001'

function seedProduct(): Product {
  return Product.create({
    productId:   ProductId.create(MESHPRO_PRODUCT_ID),
    name:        'MeshPro',
    tagline:     'Production-ready TypeScript UI components',
    description: 'A comprehensive library of 50+ fully typed React components with Figma design tokens, dark-mode support, and a11y compliance out of the box.',
    price:       Money.of(9900, 'USD'),  // $99.00
    features: [
      '50+ production-ready components',
      'Full TypeScript type safety',
      'Figma design kit included',
      'Dark mode & theming support',
      'WCAG 2.1 AA accessibility',
      'Lifetime updates & support',
    ],
  })
}

export class InMemoryProductRepository implements IProductRepository {
  private readonly store = new Map<string, Product>([[MESHPRO_PRODUCT_ID, seedProduct()]])

  async findById(id: ProductId): Promise<Product | null> {
    return this.store.get(id.value) ?? null
  }

  async findAll(): Promise<Product[]> {
    return [...this.store.values()]
  }
}
