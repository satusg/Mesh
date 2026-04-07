import express from 'express'
import cors from 'cors'
import { createOrderRouter } from './http/routes/order.routes'
import { createProductRouter } from './http/routes/product.routes'
import { createWebhookRouter } from './http/routes/webhook.routes'
import { errorHandler } from './http/middleware/errorHandler'
import { OrderController } from './http/controllers/OrderController'
import { ProductController } from './http/controllers/ProductController'
import { WebhookController } from './http/controllers/WebhookController'

export function createApp(
  orderController:   OrderController,
  productController: ProductController,
  webhookController: WebhookController,
): express.Application {
  const app = express()

  // ─── Global middleware ────────────────────────────────────────────────────
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5174' }))

  // Webhook routes must receive the raw body — register BEFORE express.json()
  app.use('/api/webhooks', createWebhookRouter(webhookController))

  app.use(express.json())

  // ─── API routes ───────────────────────────────────────────────────────────
  app.use('/api/products', createProductRouter(productController))
  app.use('/api/orders',   createOrderRouter(orderController))

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  // ─── Error handler (must be last) ─────────────────────────────────────────
  app.use(errorHandler)

  return app
}
