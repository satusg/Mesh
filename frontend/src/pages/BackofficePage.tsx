import { useEffect, useState, useCallback, useRef } from 'react'
import { api, type OrderEvent } from '@/services/api'

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

  const uniqueOrders = new Set(events.map((e) => e.orderId)).size
  const lastEvent = events[0]?.createdAt

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Backoffice</h1>
            <p className="mt-1 text-sm text-gray-500">Order events and activity log</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Auto-refresh
          </label>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Events" value={events.length} />
          <StatCard label="Orders" value={uniqueOrders} />
          <StatCard
            label="Last activity"
            value={lastEvent ? timeAgo(lastEvent) : '—'}
          />
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value as 'recent' | 'order' | 'email')
              if (e.target.value === 'recent') setSearch('')
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
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
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm"
            />
          )}

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Search
          </button>

          {searchType !== 'recent' && (
            <button
              type="button"
              onClick={() => { setSearchType('recent'); setSearch('') }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </form>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 font-medium text-gray-500">Order</th>
                <th className="px-4 py-3 font-medium text-gray-500">Event</th>
                <th className="px-4 py-3 font-medium text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <p className="text-gray-400">No events found</p>
                    <p className="mt-1 text-xs text-gray-300">
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
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
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
        className="cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
          {timeAgo(event.createdAt)}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={(e) => { e.stopPropagation(); onDrillDown(event.orderId) }}
            className="font-mono text-xs text-blue-600 hover:underline"
          >
            {event.orderId.slice(0, 8)}…
          </button>
        </td>
        <td className="px-4 py-3">
          <EventBadge type={event.eventType} />
        </td>
        <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500">
          {event.detail ? formatDetail(event.detail) : '—'}
        </td>
      </tr>
      {expanded && event.detail && (
        <tr className="bg-gray-50">
          <td colSpan={4} className="px-4 py-3">
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-200">
              {JSON.stringify(event.detail, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  )
}

function EventBadge({ type }: { type: string }) {
  let color = 'bg-gray-100 text-gray-700'
  if (type.includes('Created')) color = 'bg-blue-100 text-blue-700'
  else if (type.includes('AWAITING') || type.includes('PENDING')) color = 'bg-yellow-100 text-yellow-700'
  else if (type.includes('Paid') || type.includes('PAID')) color = 'bg-green-100 text-green-700'
  else if (type.includes('Fulfilled') || type.includes('FULFILLED')) color = 'bg-emerald-100 text-emerald-700'
  else if (type.includes('FAILED')) color = 'bg-red-100 text-red-700'

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
