import 'dotenv/config'
import { getDatabase } from './infrastructure/persistence/sqlite/database'
import { SqliteOrderRepository } from './infrastructure/persistence/sqlite/SqliteOrderRepository'
import { OrderEventStore } from './infrastructure/persistence/sqlite/OrderEventStore'
import { InMemoryProductRepository } from './infrastructure/persistence/InMemoryProductRepository'
import { MeshPaymentGateway } from './infrastructure/payment/mesh/MeshPaymentGateway'
import { ConsoleEmailGateway } from './infrastructure/email/ConsoleEmailGateway'
import { CreateOrderUseCase } from './application/use-cases/create-order/CreateOrderUseCase'
import { GetOrderUseCase } from './application/use-cases/get-order/GetOrderUseCase'
import { InitiatePaymentUseCase } from './application/use-cases/initiate-payment/InitiatePaymentUseCase'
import { ConfirmPaymentUseCase } from './application/use-cases/confirm-payment/ConfirmPaymentUseCase'
import { CompletePaymentUseCase } from './application/use-cases/complete-payment/CompletePaymentUseCase'
import { OrderController } from './interface/http/controllers/OrderController'
import { ProductController } from './interface/http/controllers/ProductController'
import { WebhookController } from './interface/http/controllers/WebhookController'
import { EventController } from './interface/http/controllers/EventController'
import { PaymentMethod } from './domain/payment/PaymentMethod'
import { IPaymentGateway } from './application/ports/gateways/IPaymentGateway'

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required environment variable: ${key}`)
  return val
}

export function buildContainer() {
  // ─── Database ─────────────────────────────────────────────────────────────
  const db = getDatabase()

  // ─── Repositories ─────────────────────────────────────────────────────────
  const orderRepo   = new SqliteOrderRepository(db)
  const productRepo = new InMemoryProductRepository()
  const eventStore  = new OrderEventStore(db)

  // ─── Payment gateways (Strategy map) ─────────────────────────────────────
  const meshGateway = new MeshPaymentGateway(
    requireEnv('MESH_CLIENT_ID'),
    requireEnv('MESH_CLIENT_SECRET'),
    process.env.MESH_RECEIVING_ADDRESS ?? '0x0000000000000000000000000000000000000000',
    process.env.MESH_NETWORK_ID        ?? 'e3c7fdd8-b1fc-4e51-85ae-bb276e075611',
    process.env.MESH_ASSET_SYMBOL      ?? 'USDC',
    process.env.MESH_SANDBOX !== 'false',
  )

  const gateways = new Map<PaymentMethod, IPaymentGateway>([
    [PaymentMethod.MESH, meshGateway],
  ])

  // ─── Email ────────────────────────────────────────────────────────────────
  const emailGateway = new ConsoleEmailGateway()

  // ─── Use cases ────────────────────────────────────────────────────────────
  const createOrder     = new CreateOrderUseCase(orderRepo, productRepo)
  const getOrder        = new GetOrderUseCase(orderRepo)
  const initiatePayment = new InitiatePaymentUseCase(orderRepo, gateways)
  const completePayment = new CompletePaymentUseCase(
    orderRepo,
    requireEnv('LICENSE_SECRET'),
    process.env.ENABLE_CLIENT_PAYMENT_CONFIRMATION === 'true' || process.env.NODE_ENV !== 'production',
  )
  const confirmPayment  = new ConfirmPaymentUseCase(
    orderRepo,
    gateways,
    emailGateway,
    requireEnv('LICENSE_SECRET'),
  )

  // ─── Controllers ─────────────────────────────────────────────────────────
  const orderController   = new OrderController(createOrder, getOrder, initiatePayment, completePayment)
  const productController = new ProductController(productRepo)
  const webhookController = new WebhookController(confirmPayment, eventStore)
  const eventController   = new EventController(eventStore)

  return { orderController, productController, webhookController, eventController }
}
