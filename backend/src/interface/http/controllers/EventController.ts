import { Request, Response, NextFunction } from 'express'
import { OrderEventStore } from '../../../infrastructure/persistence/sqlite/OrderEventStore'

export class EventController {
  constructor(private readonly eventStore: OrderEventStore) {}

  ingestClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId, eventType, detail } = req.body as {
        orderId?: string
        eventType?: string
        detail?: Record<string, unknown>
      }

      if (!orderId || !eventType) {
        res.status(400).json({
          error: { message: 'orderId and eventType are required' },
        })
        return
      }

      this.eventStore.log(orderId, eventType, detail, 'frontend')
      res.status(201).json({ logged: true })
    } catch (err) {
      next(err)
    }
  }

  getByOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = this.eventStore.findByOrderId(req.params.orderId)
      res.json({ events })
    } catch (err) {
      next(err)
    }
  }

  getByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.query.email as string
      if (!email) {
        res.status(400).json({ error: { message: 'email query parameter is required' } })
        return
      }
      const events = this.eventStore.findByEmail(email)
      res.json({ events })
    } catch (err) {
      next(err)
    }
  }

  getRecent = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = this.eventStore.recent()
      res.json({ events })
    } catch (err) {
      next(err)
    }
  }
}
