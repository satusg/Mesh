const features = [
  {
    title: 'Weighted like a display piece',
    description:
      'The coin is positioned as a physical keepsake first, with a denser feel and cleaner finish than typical conference-style giveaway tokens.',
  },
  {
    title: 'Made to look good on a shelf',
    description:
      'Each order includes a clear capsule and a numbered presentation card so the piece arrives ready for a desk, shelf, or gift box.',
  },
  {
    title: 'Simple, familiar crypto checkout',
    description:
      'Mesh keeps the payment flow familiar by connecting to exchanges and wallets your buyers already trust, without forcing manual transfer steps.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-y border-black/5 bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-gray-400">Why it stands out</p>
            <h2 className="font-serif text-4xl tracking-tight text-gray-950">
              Built like a product, not a promo item.
            </h2>
          </div>

          <div className="divide-y divide-black/10">
            {features.map((feature) => (
              <article key={feature.title} className="grid gap-3 py-6 sm:grid-cols-[220px_minmax(0,1fr)]">
                <h3 className="text-base font-semibold text-gray-950">{feature.title}</h3>
                <p className="max-w-2xl text-sm leading-7 text-gray-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
