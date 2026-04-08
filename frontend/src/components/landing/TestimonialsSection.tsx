const details = [
  {
    title: 'In the box',
    body: 'One physical USDC coin, one protective capsule, and one numbered presentation card.',
  },
  {
    title: 'For display',
    body: 'Sized and packaged to feel at home on a desk, shelf, or within a larger collector setup.',
  },
  {
    title: 'For gifting',
    body: 'Minimal packaging and clean presentation make it easy to hand off without extra wrapping or explanation.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-[#f1ece4] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-400">What arrives</p>
          <h2 className="font-serif text-4xl tracking-tight text-gray-950">A cleaner, more giftable package.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {details.map((item) => (
            <article key={item.title} className="rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_16px_40px_rgba(17,24,39,0.05)]">
              <p className="text-xs uppercase tracking-[0.28em] text-gray-400">{item.title}</p>
              <p className="mt-5 font-serif text-2xl leading-tight tracking-tight text-gray-950">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
