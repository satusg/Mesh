import { useEffect, useState, useCallback, useRef } from 'react'
import { api, type OrderEvent } from '@/services/api'
import { Button } from '@/components/ui/Button'

export function BackofficePage() {
  const [events, setEvents] = useState<OrderEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState<'recent' | 'order' | 'email'>('recent')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let result: { events: OrderEvent[] }
      if (searchType === 'order' && search) {
        result = await api.getOrderEvents(search)
      } else if (searchType === 'email' && search) {
        result = await api.getCustomerEvents(search)
      } else {
        result = await api.getRecentEvents()
      }
      setEvents(result.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [search, searchType])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchEvents, 5000)
    }
    return () => clearInterval(intervalRef.current)
  }, [autoRefresh, fetchEvents])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEvents()
  }

  const drillDown = (orderId: string) => {
    setSearchType('order')
    setSearch(orderId)
  }

  const downloadLogs = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      filter: {
        type: searchType,
        query: search,
      },
      totalEvents: events.length,
      events,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const suffix = searchType === 'recent' || !search
      ? searchType
      : `${searchType}-${search.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`

    link.href = url
    link.download = `backoffice-logs-${suffix || 'export'}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const uniqueOrders = new Set(events.map((e) => e.orderId)).size
  const lastEvent = events[0]?.createdAt

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl text-white">Backoffice</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">Order events and activity log</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-white/15 bg-transparent"
            />
            Auto-refresh
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Events" value={events.length} />
          <StatCard label="Orders" value={uniqueOrders} />
          <StatCard
            label="Last activity"
            value={lastEvent ? timeAgo(lastEvent) : '—'}
          />
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value as 'recent' | 'order' | 'email')
              if (e.target.value === 'recent') setSearch('')
            }}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200"
          >
            <option value="recent">Recent events</option>
            <option value="order">By order ID</option>
            <option value="email">By email</option>
          </select>

          {searchType !== 'recent' && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchType === 'order' ? 'Order ID…' : 'Email address…'}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500"
            />
          )}

          <button
            type="submit"
            className="rounded-full bg-white/[0.08] px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.12]"
          >
            Search
          </button>

          {searchType !== 'recent' && (
            <button
              type="button"
              onClick={() => { setSearchType('recent'); setSearch('') }}
              className="rounded-full border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
            >
              Clear
            </button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={downloadLogs}
            disabled={events.length === 0}
          >
            Download JSON
          </Button>
        </form>

        {error && (
          <p className="rounded-3xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] shadow-[0_0_60px_rgba(86,125,255,0.06)] backdrop-blur-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 bg-white/[0.02]">
              <tr>
                <th className="px-4 py-4 font-medium text-slate-500">Time</th>
                <th className="px-4 py-4 font-medium text-slate-500">Order</th>
                <th className="px-4 py-4 font-medium text-slate-500">Source</th>
                <th className="px-4 py-4 font-medium text-slate-500">Event</th>
                <th className="px-4 py-4 font-medium text-slate-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {loading && events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-slate-400">No events found</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Events appear here as orders are created and processed.
                    </p>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    expanded={expandedId === event.id}
                    onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                    onDrillDown={drillDown}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function EventRow({
  event,
  expanded,
  onToggle,
  onDrillDown,
}: {
  event: OrderEvent
  expanded: boolean
  onToggle(): void
  onDrillDown(orderId: string): void
}) {
  return (
    <>
      <tr
        className="cursor-pointer hover:bg-white/[0.03]"
        onClick={onToggle}
      >
        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
          {timeAgo(event.createdAt)}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={(e) => { e.stopPropagation(); onDrillDown(event.orderId) }}
            className="font-mono text-xs text-[#9dd6ff] hover:underline"
          >
            {event.orderId.slice(0, 8)}…
          </button>
        </td>
        <td className="px-4 py-3">
          <SourceBadge event={event} />
        </td>
        <td className="px-4 py-3">
          <EventBadge type={event.eventType} />
        </td>
        <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-400">
          {event.detail ? formatDetail(event.detail) : '—'}
        </td>
      </tr>
      {expanded && event.detail && (
        <tr className="bg-white/[0.02]">
          <td colSpan={5} className="px-4 py-3">
            <pre className="overflow-x-auto rounded-2xl bg-[#050816] p-3 text-xs text-slate-300">
              {JSON.stringify(event.detail, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  )
}

function SourceBadge({ event }: { event: OrderEvent }) {
  const source = event.detail?.source === 'frontend' ? 'frontend' : 'backend'
  const color = source === 'frontend'
    ? 'bg-[#9dd6ff]/12 text-[#9dd6ff]'
    : 'bg-white/[0.07] text-slate-300'

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {source}
    </span>
  )
}

function EventBadge({ type }: { type: string }) {
  let color = 'bg-white/[0.07] text-slate-300'
  if (type.includes('Created')) color = 'bg-[#9dd6ff]/12 text-[#9dd6ff]'
  else if (type.includes('AWAITING') || type.includes('PENDING')) color = 'bg-amber-300/12 text-amber-200'
  else if (type.includes('Paid') || type.includes('PAID')) color = 'bg-emerald-300/12 text-emerald-200'
  else if (type.includes('Fulfilled') || type.includes('FULFILLED')) color = 'bg-cyan-300/12 text-cyan-200'
  else if (type.includes('FAILED')) color = 'bg-red-300/12 text-red-200'

  const label = type
    .replace('StatusChanged:', '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

function formatDetail(detail: Record<string, unknown>): string {
  const parts: string[] = []
  if (detail.email) parts.push(`${detail.email}`)
  if (detail.customerName) parts.push(`${detail.customerName}`)
  if (detail.productName) parts.push(`${detail.productName}`)
  if (detail.amount) parts.push(`$${(Number(detail.amount) / 100).toFixed(2)}`)
  if (detail.status) parts.push(`${detail.status}`)
  if (detail.licenseKey) parts.push(`key: ${String(detail.licenseKey).slice(0, 12)}…`)
  return parts.length > 0 ? parts.join(' · ') : JSON.stringify(detail)
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
