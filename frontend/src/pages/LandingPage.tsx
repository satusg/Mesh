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

      {/* Final CTA */}
      <section className="bg-brand-950 py-20 px-4 text-center sm:px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to build faster?
          </h2>
          <p className="mt-4 text-brand-200">
            Join 2,400+ developers shipping polished UIs with MeshPro.
          </p>
          <div className="mt-8">
            <Link to="/checkout">
              <Button size="lg" className="min-w-56">
                Get MeshPro — $99
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-brand-400">30-day money-back guarantee</p>
        </div>
      </section>
    </>
  )
}
