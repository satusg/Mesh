import { Router } from 'express'
import { EventController } from '../controllers/EventController'

export function createEventRouter(controller: EventController): Router {
  const router = Router()

  router.get('/recent',           controller.getRecent)
  router.get('/order/:orderId',   controller.getByOrder)
  router.get('/customer',         controller.getByEmail)

  return router
}
