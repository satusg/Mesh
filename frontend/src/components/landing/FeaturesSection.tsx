const features = [
  {
    icon: '⚡',
    title: '50+ Ready-to-use Components',
    description:
      'From simple buttons and inputs to complex data tables, modals, and command palettes — all thoroughly tested and documented.',
  },
  {
    icon: '🔷',
    title: 'Full TypeScript Support',
    description:
      'Every component ships with comprehensive type definitions. Autocomplete, prop validation, and zero any types out of the box.',
  },
  {
    icon: '🎨',
    title: 'Figma Design Kit',
    description:
      'Matching Figma components with design tokens, auto-layout, and variants — keep design and code perfectly in sync.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode & Theming',
    description:
      'First-class dark mode via CSS variables. Customise colours, radii, and spacing through a single theme config.',
  },
  {
    icon: '♿',
    title: 'WCAG 2.1 AA Accessible',
    description:
      'Keyboard navigation, ARIA labels, focus rings, and colour contrast tested against WCAG guidelines on every component.',
  },
  {
    icon: '♾️',
    title: 'Lifetime Updates',
    description:
      'Pay once, get every future release forever. We publish major versions roughly every six months with migration guides.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to ship faster
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            MeshPro handles the design system so your team can focus on product.
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-100 bg-gray-50 p-6 transition-shadow hover:shadow-md">
              <dt className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-hidden="true">{f.icon}</span>
                <span className="font-semibold text-gray-900">{f.title}</span>
              </dt>
              <dd className="mt-3 text-sm leading-6 text-gray-600">{f.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
