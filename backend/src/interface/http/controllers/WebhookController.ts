import { Request, Response, NextFunction } from 'express'
import { ConfirmPaymentUseCase } from '../../../application/use-cases/confirm-payment/ConfirmPaymentUseCase'

type RawRequest = Request & { rawBody: Buffer }

export class WebhookController {
  constructor(private readonly confirmPayment: ConfirmPaymentUseCase) {}

  handleMesh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawBody   = (req as RawRequest).rawBody
      const signature = req.headers['x-mesh-signature'] as string ?? ''

      await this.confirmPayment.execute({ rawPayload: rawBody, signature, gatewayType: 'mesh' })
      res.json({ received: true })
    } catch (err) {
      next(err)
    }
  }
}
