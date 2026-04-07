import { useEffect, useRef } from 'react'
import { createLink } from '@meshconnect/web-link-sdk'
import type { Link } from '@meshconnect/web-link-sdk'

interface MeshPayButtonProps {
  /** The Mesh link token returned by the backend when payment is initiated */
  linkToken: string
  onSuccess(): void
  onError(message: string): void
}

/**
 * MeshPayButton — best-practice implementation per https://docs.meshconnect.com/advanced/best-ux-practices
 *
 * The link token is pre-fetched by CheckoutForm when the user selects the Mesh method,
 * so clicking this button opens the iframe instantly (no loading delay on click).
 */
export function MeshPayButton({ linkToken, onSuccess, onError }: MeshPayButtonProps) {
  const meshRef = useRef<Link | null>(null)

  const handleClick = () => {
    if (!linkToken) {
      onError('Missing Mesh link token. Please retry payment initiation.')
      return
    }

    const clientId = import.meta.env.VITE_MESH_CLIENT_ID ?? ''
    if (!clientId) {
      onError('Missing VITE_MESH_CLIENT_ID in frontend environment.')
      return
    }

    if (!meshRef.current) {
      try {
        meshRef.current = createLink({
          clientId,

          onIntegrationConnected: (payload) => {
            console.info('[Mesh] Integration connected:', payload)
          },

          onTransferFinished: (payload) => {
            console.info('[Mesh] Transfer finished:', payload)
            if ('errorMessage' in payload && payload.errorMessage) {
              onError(payload.errorMessage as string)
            } else {
              onSuccess()
            }
          },

          onExit: (error, summary) => {
            console.info('[Mesh] Exit', { error, summary })
            if (error) onError(error)
          },

          onEvent: (event) => {
            console.debug('[Mesh] Event:', event)
          },
        })
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to initialize Mesh SDK')
        return
      }
    }

    meshRef.current?.openLink(linkToken)
  }

  useEffect(() => {
    return () => {
      meshRef.current?.closeLink?.()
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Main CTA — following best-UX-practices: show trusted exchange logos */}
      <button
        type="button"
        onClick={handleClick}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border-2 border-brand-600 bg-white px-5 py-4 text-left shadow-sm transition-all hover:bg-brand-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <div className="flex items-center gap-3">
          {/* Mesh icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
            ₿
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Pay with Crypto</p>
            <p className="text-xs text-gray-500 mt-0.5">
              One-click from Coinbase, Binance, MetaMask &amp; 300+ more
            </p>
          </div>
        </div>
        <svg
          className="h-5 w-5 text-brand-600 transition-transform group-hover:translate-x-0.5"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Trusted exchange logos row */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-gray-400">Supported:</span>
        {['Coinbase', 'Binance', 'Kraken', 'MetaMask'].map((name) => (
          <span
            key={name}
            className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600"
          >
            {name}
          </span>
        ))}
        <span className="text-xs text-gray-400">+296</span>
      </div>

      <p className="text-center text-xs text-gray-400">
        Secured by Mesh Connect · No wallet address needed
      </p>
    </div>
  )
}
