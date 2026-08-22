import { Pool } from 'pg'

let pool: Pool | undefined

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const { DB_HOST, DB_PORT = '5432', DB_NAME, DB_USER, DB_PASSWORD } = process.env
  if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) throw new Error('SERVER_MISCONFIGURED')

  return `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${encodeURIComponent(DB_NAME)}`
}

function integerEnv(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] ?? '', 10)
  return Number.isInteger(value) && value >= 0 ? value : fallback
}

/** Shared PostgreSQL pool; all call sites use parameterized queries. */
export function database() {
  if (pool) return pool
  const sslEnabled = process.env.DB_SSL !== 'false'
  const poolMin = integerEnv('DB_POOL_MIN', 0)
  const poolMax = Math.max(poolMin, integerEnv('DB_POOL_MAX', 10))

  pool = new Pool({
    connectionString: databaseUrl(),
    ssl: sslEnabled ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
    min: poolMin,
    max: poolMax,
    connectionTimeoutMillis: integerEnv('DB_CONNECTION_TIMEOUT_MS', 10_000),
    idleTimeoutMillis: integerEnv('DB_IDLE_TIMEOUT_MS', 30_000),
  })
  return pool
}
