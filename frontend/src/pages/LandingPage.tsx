import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />

      <section className="bg-gray-950 px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Ready</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-white sm:text-5xl">
            Bring home the collector edition.
          </h2>
          <p className="mt-4 text-sm leading-7 text-gray-300">
            A physical USDC coin with restrained packaging, straightforward pricing, and secure crypto checkout.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/checkout">
              <Button size="lg" className="min-w-56">
                Order now
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">$99. One-time purchase.</p>
        </div>
      </section>
    </>
  )
}
