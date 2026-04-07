import { Request, Response, NextFunction } from 'express'
import { IProductRepository } from '../../../application/ports/repositories/IProductRepository'
import { MESHPRO_PRODUCT_ID } from '../../../infrastructure/persistence/InMemoryProductRepository'
import { ProductId } from '../../../domain/product/ProductId'

export class ProductController {
  constructor(private readonly productRepo: IProductRepository) {}

  getProduct = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productRepo.findById(ProductId.create(MESHPRO_PRODUCT_ID))
      if (!product) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } })
        return
      }
      res.json({
        productId:   product.productId.value,
        name:        product.name,
        tagline:     product.tagline,
        description: product.description,
        price:       product.price.amount,
        currency:    product.price.currency,
        features:    product.features,
      })
    } catch (err) {
      next(err)
    }
  }

  listProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.productRepo.findAll()
      res.json(
        products.map((p) => ({
          productId: p.productId.value,
          name:      p.name,
          tagline:   p.tagline,
          price:     p.price.amount,
          currency:  p.price.currency,
        })),
      )
    } catch (err) {
      next(err)
    }
  }
}
