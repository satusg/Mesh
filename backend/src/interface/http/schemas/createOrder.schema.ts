import { z } from 'zod'

export const createOrderSchema = z.object({
  productId: z.string().uuid(),
  customer: z.object({
    email:    z.string().email(),
    fullName: z.string().min(2).max(100),
  }),
})

export type CreateOrderBody = z.infer<typeof createOrderSchema>
