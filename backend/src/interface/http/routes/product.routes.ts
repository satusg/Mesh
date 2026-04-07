import { Router } from 'express'
import { ProductController } from '../controllers/ProductController'

export function createProductRouter(controller: ProductController): Router {
  const router = Router()

  router.get('/',        controller.listProducts)
  router.get('/meshpro', controller.getProduct)

  return router
}
