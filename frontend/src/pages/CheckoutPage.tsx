import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export function CheckoutPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(86,125,255,0.08)] backdrop-blur-sm sm:p-10">
          <CheckoutForm />
        </div>
      </div>
    </main>
  )
}
