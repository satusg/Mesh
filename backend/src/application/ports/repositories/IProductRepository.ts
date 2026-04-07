import { Product } from '../../../domain/product/Product'
import { ProductId } from '../../../domain/product/ProductId'

export interface IProductRepository {
  findById(id: ProductId): Promise<Product | null>
  findAll(): Promise<Product[]>
}
