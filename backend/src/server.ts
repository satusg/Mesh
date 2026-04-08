import 'dotenv/config'
import { buildContainer } from './container'
import { createApp } from './interface/app'

const PORT = parseInt(process.env.PORT ?? '3001', 10)

const { orderController, productController, webhookController, eventController } = buildContainer()
const app = createApp(orderController, productController, webhookController, eventController)

app.listen(PORT, () => {
  console.log(`[Backend] [USDC Coin API] Listening on http://localhost:${PORT}`)
  console.log(`[Backend] [USDC Coin API] Health: http://localhost:${PORT}/health`)
})
