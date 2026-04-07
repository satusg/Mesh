import { Router } from 'express'
import { WebhookController } from '../controllers/WebhookController'
import { rawBodyMiddleware } from '../middleware/rawBodyMiddleware'

export function createWebhookRouter(controller: WebhookController): Router {
  const router = Router()

  // Raw body required for all webhook signature verification
  router.post('/mesh',   rawBodyMiddleware, controller.handleMesh)

  return router
}
