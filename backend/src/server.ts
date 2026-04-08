import 'dotenv/config'
import { buildContainer } from './container'
import { createApp } from './interface/app'

const PORT = parseInt(process.env.PORT ?? '3001', 10)

const { orderController, productController, webhookController } = buildContainer()
const app = createApp(orderController, productController, webhookController)

app.listen(PORT, () => {
  console.log(`[USDC Coin API] Listening on http://localhost:${PORT}`)
  console.log(`[USDC Coin API] Health: http://localhost:${PORT}/health`)
})
