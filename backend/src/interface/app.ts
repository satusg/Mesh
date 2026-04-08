import express from 'express'
import cors from 'cors'
import { createOrderRouter } from './http/routes/order.routes'
import { createProductRouter } from './http/routes/product.routes'
import { createWebhookRouter } from './http/routes/webhook.routes'
import { createEventRouter } from './http/routes/event.routes'
import { errorHandler } from './http/middleware/errorHandler'
import { OrderController } from './http/controllers/OrderController'
import { ProductController } from './http/controllers/ProductController'
import { WebhookController } from './http/controllers/WebhookController'
import { EventController } from './http/controllers/EventController'

export function createApp(
  orderController:   OrderController,
  productController: ProductController,
  webhookController: WebhookController,
  eventController?:  EventController,
): express.Application {
  const app = express()
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  // ─── Global middleware ────────────────────────────────────────────────────
  app.use(cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and configured frontend origins.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(null, false)
    },
  }))

  // Webhook routes must receive the raw body — register BEFORE express.json()
  app.use('/api/webhooks', createWebhookRouter(webhookController))

  app.use(express.json())

  // ─── API routes ───────────────────────────────────────────────────────────
  app.use('/api/products', createProductRouter(productController))
  app.use('/api/orders',   createOrderRouter(orderController))
  if (eventController) {
    app.use('/api/events', createEventRouter(eventController))
  }

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  // ─── Error handler (must be last) ─────────────────────────────────────────
  app.use(errorHandler)

  return app
}
