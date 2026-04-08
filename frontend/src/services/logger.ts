import { api } from '@/services/api'

type FrontendLogLevel = 'debug' | 'info' | 'warn' | 'error'

function serialiseMeta(meta: unknown): Record<string, unknown> | undefined {
  if (meta == null) return undefined
  if (typeof meta === 'object' && !Array.isArray(meta)) {
    return meta as Record<string, unknown>
  }

  return { value: meta }
}

async function publish(
  level: FrontendLogLevel,
  message: string,
  orderId?: string,
  meta?: unknown,
) {
  if (!orderId) return

  try {
    await api.logClientEvent({
      orderId,
      eventType: `Frontend:${level}`,
      detail: {
        level,
        message,
        ...serialiseMeta(meta),
      },
    })
  } catch {
    // Keep client logging best-effort only.
  }
}

function write(level: FrontendLogLevel, message: string, orderId?: string, meta?: unknown) {
  const prefix = `[Frontend] ${message}`

  if (level === 'error') console.error(prefix, meta)
  else if (level === 'warn') console.warn(prefix, meta)
  else if (level === 'debug') console.debug(prefix, meta)
  else console.info(prefix, meta)

  void publish(level, message, orderId, meta)
}

export const frontendLogger = {
  debug(message: string, orderId?: string, meta?: unknown) {
    write('debug', message, orderId, meta)
  },
  info(message: string, orderId?: string, meta?: unknown) {
    write('info', message, orderId, meta)
  },
  warn(message: string, orderId?: string, meta?: unknown) {
    write('warn', message, orderId, meta)
  },
  error(message: string, orderId?: string, meta?: unknown) {
    write('error', message, orderId, meta)
  },
}
