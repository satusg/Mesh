import { useState } from 'react'

const faqs = [
  {
    q: 'Is this a digital product?',
    a: 'No. This storefront now sells a physical USDC collector coin. Payment happens online, but the product itself is a real display piece.',
  },
  {
    q: 'What do I receive after checkout?',
    a: 'You receive an order confirmation by email, followed by status updates as the order is processed and prepared for fulfillment.',
  },
  {
    q: 'What is included in the order?',
    a: 'Each order includes one physical USDC coin, a protective capsule, and a numbered presentation card.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. If the coin is not the right fit, you can request a return within 30 days of delivery.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Notes</p>
          <h2 className="font-serif text-5xl tracking-tight text-white">A few practical details.</h2>
        </div>

        <dl className="divide-y divide-white/8 border-y border-white/8">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="py-1">
              <dt>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="text-base font-medium text-white">{faq.q}</span>
                  <span className="text-slate-500">{open === i ? '−' : '+'}</span>
                </button>
              </dt>
              {open === i && (
                <dd className="max-w-3xl pb-5 text-sm leading-8 text-slate-400">
                  {faq.a}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
