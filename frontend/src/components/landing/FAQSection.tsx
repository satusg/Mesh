import { useState } from 'react'

const faqs = [
  {
    q: 'Is this a subscription or a one-time purchase?',
    a: 'One-time purchase. Pay $99 once and receive lifetime access to all current and future versions of MeshPro.',
  },
  {
    q: 'What frameworks does MeshPro support?',
    a: 'MeshPro is built for React 18+ with TypeScript. It uses CSS variables for theming, so it is compatible with any styling solution (Tailwind, CSS Modules, styled-components).',
  },
  {
    q: 'How do I receive my license key?',
    a: 'Immediately after your payment is confirmed, your license key is emailed to you and displayed on the confirmation page. Use it to activate your private GitHub repository access.',
  },
  {
    q: 'Can I use MeshPro in client projects?',
    a: 'Yes. A single license covers unlimited personal and commercial projects for one developer. Team licenses (5-seat, unlimited-seat) are available on request.',
  },
  {
    q: 'What is your refund policy?',
    a: 'If you are not satisfied within 30 days of purchase, contact support for a full refund — no questions asked.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-gray-50 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <dl className="mt-12 space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <dt>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  aria-expanded={open === i}
                >
                  {faq.q}
                  <svg
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </dt>
              {open === i && (
                <dd className="px-6 pb-4 text-sm text-gray-600 leading-6 border-t border-gray-100">
                  <p className="pt-3">{faq.a}</p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
