import { useEffect, useRef } from 'react'
import { createLink } from '@meshconnect/web-link-sdk'
import type { Link } from '@meshconnect/web-link-sdk'
import { frontendLogger } from '@/services/logger'

interface MeshPayButtonProps {
  linkToken: string
  orderId: string
  onSuccess(): void
  onError(message: string): void
}

export function MeshPayButton({ linkToken, orderId, onSuccess, onError }: MeshPayButtonProps) {
  const meshRef = useRef<Link | null>(null)

  const ensureLink = () => {
    if (!linkToken) {
      onError('Missing Mesh link token. Please retry payment initiation.')
      return null
    }

    const clientId = import.meta.env.VITE_MESH_CLIENT_ID ?? ''
    if (!clientId) {
      onError('Missing VITE_MESH_CLIENT_ID in frontend environment.')
      return null
    }

    if (!meshRef.current) {
      try {
        meshRef.current = createLink({
          clientId,

          onIntegrationConnected: (payload) => {
            frontendLogger.info('Mesh integration connected', orderId, payload)
          },

          onTransferFinished: (payload) => {
            frontendLogger.info('Mesh transfer finished', orderId, payload)
            if ('errorMessage' in payload && payload.errorMessage) {
              onError(payload.errorMessage as string)
            } else {
              onSuccess()
            }
          },

          onExit: (error, summary) => {
            frontendLogger.info('Mesh link exited', orderId, { error, summary })
            if (error) onError(error)
          },

          onEvent: (event) => {
            frontendLogger.debug('Mesh event received', orderId, event)
          },
        })
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to initialize Mesh SDK')
        return null
      }
    }

    return meshRef.current
  }

  const handleClick = () => {
    const link = ensureLink()
    if (!link) return
    link.openLink(linkToken)
  }

  useEffect(() => {
    return () => {
      meshRef.current?.closeLink?.()
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
      Pay with crypto
    </button>
  )
}
