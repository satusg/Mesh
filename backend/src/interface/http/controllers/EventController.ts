import { Request, Response, NextFunction } from 'express'
import { OrderEventStore } from '../../../infrastructure/persistence/sqlite/OrderEventStore'

export class EventController {
  constructor(private readonly eventStore: OrderEventStore) {}

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
