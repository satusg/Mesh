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
    title: 'Pay with crypto, not QR codes',
    description:
      'Mesh keeps checkout familiar by connecting to exchanges and wallets buyers already trust, so they can review and confirm inside the embedded flow instead of copying addresses by hand.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-y border-white/8 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Object notes</p>
            <h2 className="font-serif text-5xl tracking-tight text-white">
              Less novelty. More presence.
            </h2>
          </div>

          <div className="divide-y divide-white/8">
            {features.map((feature) => (
              <article key={feature.title} className="grid gap-4 py-7 sm:grid-cols-[240px_minmax(0,1fr)]">
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="max-w-2xl text-sm leading-8 text-slate-400">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
