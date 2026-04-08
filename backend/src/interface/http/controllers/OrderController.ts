import { Request, Response, NextFunction } from 'express'
import { CreateOrderUseCase } from '../../../application/use-cases/create-order/CreateOrderUseCase'
import { GetOrderUseCase } from '../../../application/use-cases/get-order/GetOrderUseCase'
import { InitiatePaymentUseCase } from '../../../application/use-cases/initiate-payment/InitiatePaymentUseCase'
import { CompletePaymentUseCase } from '../../../application/use-cases/complete-payment/CompletePaymentUseCase'
import { createOrderSchema } from '../schemas/createOrder.schema'
import { initiatePaymentSchema } from '../schemas/initiatePayment.schema'
import { completePaymentSchema } from '../schemas/completePayment.schema'

export class OrderController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly initiatePayment: InitiatePaymentUseCase,
    private readonly completePayment: CompletePaymentUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = createOrderSchema.parse(req.body)
      const result = await this.createOrder.execute(body)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getOrder.execute({ orderId: req.params.orderId })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  initiate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = initiatePaymentSchema.parse(req.body)
      const result = await this.initiatePayment.execute({
        orderId: req.params.orderId,
        method:  body.method,
      })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  complete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = completePaymentSchema.parse(req.body)
      await this.completePayment.execute({
        orderId: req.params.orderId,
        gatewayReference: body.gatewayReference,
      })
      res.json({ completed: true })
    } catch (err) {
      next(err)
    }
  }
}
