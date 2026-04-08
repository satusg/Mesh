import { IProductRepository } from '../../application/ports/repositories/IProductRepository'
import { Product } from '../../domain/product/Product'
import { ProductId } from '../../domain/product/ProductId'
import { Money } from '../../domain/payment/Money'

/** The single product offered — seeded once at startup. */
export const MESHPRO_PRODUCT_ID = 'a1b2c3d4-0000-0000-0000-000000000001'

function seedProduct(): Product {
  return Product.create({
    productId:   ProductId.create(MESHPRO_PRODUCT_ID),
    name:        'Physical USDC Coin',
    tagline:     'A display-ready collector coin inspired by native digital dollars.',
    description: 'A solid metal USDC collector coin made for shelves, desks, and gift sets. Each order includes a protective capsule and presentation card for a cleaner retail-style unboxing experience.',
    price:       Money.of(9900, 'USD'),  // $99.00
    features: [
      'Solid metal collector coin',
      'Protective clear capsule included',
      'Numbered presentation card',
      'Clean display-ready packaging',
      'Tracked fulfillment updates by email',
      '30-day return window',
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
