import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (db) return db

  const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'mesh.db')

  // Ensure the directory exists
  const dir = path.dirname(dbPath)
  const fs = require('fs')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  migrate(db)

  return db
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id            TEXT PRIMARY KEY,
      customer_id   TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      product_id    TEXT NOT NULL,
      product_name  TEXT NOT NULL,
      product_price INTEGER NOT NULL,
      currency      TEXT NOT NULL,
      status        TEXT NOT NULL,
      license_key   TEXT,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id                TEXT PRIMARY KEY,
      order_id          TEXT NOT NULL REFERENCES orders(id),
      method            TEXT NOT NULL,
      amount            INTEGER NOT NULL,
      currency          TEXT NOT NULL,
      status            TEXT NOT NULL,
      gateway_reference TEXT,
      paid_at           TEXT
    );

    CREATE TABLE IF NOT EXISTS order_events (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id   TEXT NOT NULL REFERENCES orders(id),
      event_type TEXT NOT NULL,
      detail     TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_gateway_ref ON payments(gateway_reference);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
  `)
}
