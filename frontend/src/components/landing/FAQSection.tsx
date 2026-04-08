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
    <section id="faq" className="bg-[#f7f3ee] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-400">FAQ</p>
          <h2 className="font-serif text-4xl tracking-tight text-gray-950">A few practical questions.</h2>
        </div>

        <dl className="divide-y divide-black/10 border-y border-black/10">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="py-1">
              <dt>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="text-base font-medium text-gray-950">{faq.q}</span>
                  <span className="text-gray-400">{open === i ? '−' : '+'}</span>
                </button>
              </dt>
              {open === i && (
                <dd className="max-w-3xl pb-5 text-sm leading-7 text-gray-600">
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
