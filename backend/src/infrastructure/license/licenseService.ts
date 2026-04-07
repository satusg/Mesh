import { createHmac } from 'crypto'

/**
 * Generates a deterministic license key from an orderId + secret.
 * HMAC-based: idempotent on re-delivery, no separate storage needed.
 * Format: MESH-XXXX-XXXX-XXXX-XXXX (20 hex chars in 4 groups)
 */
export function generateLicenseKey(orderId: string, secret: string): string {
  const hash = createHmac('sha256', secret).update(orderId).digest('hex')
  const chunk = (s: string, n: number): string[] =>
    Array.from({ length: Math.ceil(s.length / n) }, (_, i) => s.slice(i * n, i * n + n))
  const parts = chunk(hash.slice(0, 16).toUpperCase(), 4)
  return `MESH-${parts.join('-')}`
}
