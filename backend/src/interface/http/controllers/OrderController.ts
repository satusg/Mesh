import { Request, Response, NextFunction } from 'express'
import { CreateOrderUseCase } from '../../../application/use-cases/create-order/CreateOrderUseCase'
import { GetOrderUseCase } from '../../../application/use-cases/get-order/GetOrderUseCase'
import { InitiatePaymentUseCase } from '../../../application/use-cases/initiate-payment/InitiatePaymentUseCase'
import { createOrderSchema } from '../schemas/createOrder.schema'
import { initiatePaymentSchema } from '../schemas/initiatePayment.schema'

export class OrderController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly initiatePayment: InitiatePaymentUseCase,
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
}
