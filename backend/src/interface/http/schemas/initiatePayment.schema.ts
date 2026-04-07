import { z } from 'zod'
import { PaymentMethod } from '../../../domain/payment/PaymentMethod'

export const initiatePaymentSchema = z.object({
  method: z.nativeEnum(PaymentMethod),
})

export type InitiatePaymentBody = z.infer<typeof initiatePaymentSchema>
