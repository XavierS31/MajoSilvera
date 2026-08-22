import { Pool } from 'pg'

let pool: Pool | undefined
/** Shared PostgreSQL pool; all call sites use parameterized queries. */
export function database() {
  if (pool) return pool
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('SERVER_MISCONFIGURED')
  pool = new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined })
  return pool
}
