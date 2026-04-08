import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <CheckoutForm />
        </div>
      </div>
    </main>
  )
}
