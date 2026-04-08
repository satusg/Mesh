import Database from 'better-sqlite3'

export interface OrderEvent {
  id: number
  orderId: string
  eventType: string
  detail: Record<string, unknown> | null
  createdAt: string
}

interface OrderEventRow {
  id: number
  order_id: string
  event_type: string
  detail: string | null
  created_at: string
}

export class OrderEventStore {
  constructor(private readonly db: Database.Database) {}

  log(orderId: string, eventType: string, detail?: Record<string, unknown>): void {
    this.db.prepare(
      'INSERT INTO order_events (order_id, event_type, detail) VALUES (?, ?, ?)',
    ).run(orderId, eventType, detail ? JSON.stringify(detail) : null)
  }

  findByOrderId(orderId: string): OrderEvent[] {
    const rows = this.db.prepare(
      'SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC',
    ).all(orderId) as OrderEventRow[]

    return rows.map((r) => ({
      id: r.id,
      orderId: r.order_id,
      eventType: r.event_type,
      detail: r.detail ? JSON.parse(r.detail) : null,
      createdAt: r.created_at,
    }))
  }

  findByEmail(email: string): OrderEvent[] {
    const rows = this.db.prepare(`
      SELECT e.* FROM order_events e
      JOIN orders o ON e.order_id = o.id
      WHERE o.customer_email = ?
      ORDER BY e.created_at ASC
    `).all(email) as OrderEventRow[]

    return rows.map((r) => ({
      id: r.id,
      orderId: r.order_id,
      eventType: r.event_type,
      detail: r.detail ? JSON.parse(r.detail) : null,
      createdAt: r.created_at,
    }))
  }

  recent(limit = 50): OrderEvent[] {
    const rows = this.db.prepare(
      'SELECT * FROM order_events ORDER BY created_at DESC LIMIT ?',
    ).all(limit) as OrderEventRow[]

    return rows.map((r) => ({
      id: r.id,
      orderId: r.order_id,
      eventType: r.event_type,
      detail: r.detail ? JSON.parse(r.detail) : null,
      createdAt: r.created_at,
    }))
  }
}
