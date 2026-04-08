import { Request, Response, NextFunction } from 'express'
import { ConfirmPaymentUseCase } from '../../../application/use-cases/confirm-payment/ConfirmPaymentUseCase'
import { OrderEventStore } from '../../../infrastructure/persistence/sqlite/OrderEventStore'

type RawRequest = Request & { rawBody: Buffer }

export class WebhookController {
  constructor(
    private readonly confirmPayment: ConfirmPaymentUseCase,
    private readonly eventStore?: OrderEventStore,
  ) {}

  handleMesh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawBody   = (req as RawRequest).rawBody
      const signature = req.headers['x-mesh-signature'] as string ?? ''

      // Log the raw webhook before processing
      let webhookPayload: Record<string, unknown> = {}
      try { webhookPayload = JSON.parse(rawBody.toString()) } catch { /* non-JSON body */ }

      const orderId =
        (webhookPayload.content as Record<string, unknown>)?.transactionId as string ??
        (webhookPayload.content as Record<string, unknown>)?.transferDetails as Record<string, unknown> != null
          ? ((webhookPayload.content as Record<string, unknown>)?.transferDetails as Record<string, unknown>)?.transactionId as string
          : undefined

      if (this.eventStore && orderId) {
        this.eventStore.log(orderId, 'WebhookReceived', {
          type: webhookPayload.type as string,
          status: (webhookPayload.content as Record<string, unknown>)?.status as string,
        })
      }

      await this.confirmPayment.execute({ rawPayload: rawBody, signature, gatewayType: 'mesh' })
      res.json({ received: true })
    } catch (err) {
      next(err)
    }
  }
}
