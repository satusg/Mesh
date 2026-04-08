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
  const latestHandlersRef = useRef({ orderId, onSuccess, onError })

  useEffect(() => {
    latestHandlersRef.current = { orderId, onSuccess, onError }
  }, [orderId, onSuccess, onError])

  const ensureLink = () => {
    if (!linkToken) {
      latestHandlersRef.current.onError('Missing Mesh link token. Please retry payment initiation.')
      return null
    }

    const clientId = import.meta.env.VITE_MESH_CLIENT_ID ?? ''
    if (!clientId) {
      latestHandlersRef.current.onError('Missing VITE_MESH_CLIENT_ID in frontend environment.')
      return null
    }

    if (!meshRef.current) {
      try {
        meshRef.current = createLink({
          clientId,

          onIntegrationConnected: (payload) => {
            frontendLogger.info('Mesh integration connected', latestHandlersRef.current.orderId, payload)
          },

          onTransferFinished: (payload) => {
            frontendLogger.info('Mesh transfer finished', latestHandlersRef.current.orderId, payload)
            if ('errorMessage' in payload && payload.errorMessage) {
              latestHandlersRef.current.onError(payload.errorMessage as string)
            } else {
              latestHandlersRef.current.onSuccess()
            }
          },

          onExit: (error, summary) => {
            frontendLogger.info('Mesh link exited', latestHandlersRef.current.orderId, { error, summary })
            if (error) latestHandlersRef.current.onError(error)
          },

          onEvent: (event) => {
            frontendLogger.debug('Mesh event received', latestHandlersRef.current.orderId, event)
          },
        })
      } catch (err) {
        latestHandlersRef.current.onError(err instanceof Error ? err.message : 'Failed to initialize Mesh SDK')
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
    meshRef.current?.closeLink?.()
    meshRef.current = null
  }, [orderId, linkToken])

  useEffect(() => {
    return () => {
      meshRef.current?.closeLink?.()
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-full bg-[#edf6ff] px-5 py-3.5 text-sm font-semibold text-[#07111f] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9dd6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b19]"
    >
      Pay with crypto
    </button>
  )
}
