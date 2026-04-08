import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { CustomerFormValues } from '@/types'

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Please enter a valid email address'),
})

interface CustomerFormProps {
  onSubmit(values: CustomerFormValues): Promise<void>
  isLoading: boolean
}

export function CustomerForm({ onSubmit, isLoading }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Full name"
        placeholder="Jane Smith"
        error={errors.fullName?.message}
        autoComplete="name"
        {...register('fullName')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="jane@example.com"
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Continue to payment
      </Button>
    </form>
  )
}
