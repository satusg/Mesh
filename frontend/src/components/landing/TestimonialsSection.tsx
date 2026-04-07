const testimonials = [
  {
    quote:
      "We integrated MeshPro in a weekend and launched our dashboard two sprints ahead of schedule. The TypeScript types alone saved us days of debugging.",
    name:   'Sarah Chen',
    role:   'Lead Engineer, Veritas Labs',
    avatar: 'SC',
  },
  {
    quote:
      "The Figma kit is exactly what we needed — I can hand designs to developers and they map 1:1 to real components. No more 'close enough' implementations.",
    name:   'Marco Ricci',
    role:   'Product Designer, Flowstate',
    avatar: 'MR',
  },
  {
    quote:
      "Dark mode worked flawlessly out of the box. The accessibility defaults are excellent — we passed our first a11y audit without a single remediation.",
    name:   'Amara Diallo',
    role:   'Frontend Architect, Kibo Finance',
    avatar: 'AD',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by engineering teams
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <blockquote>
                <p className="text-sm leading-6 text-gray-700">"{t.quote}"</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
