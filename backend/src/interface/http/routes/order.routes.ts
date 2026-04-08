import { Router } from 'express'
import { OrderController } from '../controllers/OrderController'

export function createOrderRouter(controller: OrderController): Router {
  const router = Router()

  router.post('/',                       controller.create)
  router.get('/:orderId',                controller.get)
  router.post('/:orderId/payment',       controller.initiate)
  router.post('/:orderId/payment/complete', controller.complete)

  return router
}
