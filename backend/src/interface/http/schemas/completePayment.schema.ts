import { z } from 'zod'

export const completePaymentSchema = z.object({
  gatewayReference: z.string().min(1),
})

export type CompletePaymentBody = z.infer<typeof completePaymentSchema>
