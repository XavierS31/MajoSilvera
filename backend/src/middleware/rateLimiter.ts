import type { ApiEvent } from '../types.js'

type WindowEntry = { count: number; reset: number }
const buckets = new Map<string, WindowEntry>()
export function assertRateLimit(event: ApiEvent, scope: string, limit: number, windowMs = 60_000) {
  const ip = event.requestContext.http.sourceIp || event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  const key = `${scope}:${ip}`; const now = Date.now(); const entry = buckets.get(key)
  if (!entry || entry.reset < now) { buckets.set(key, { count: 1, reset: now + windowMs }); return }
  entry.count += 1
  if (entry.count > limit) { const error = new Error('RATE_LIMITED') as Error & { retryAfter: number }; error.retryAfter = Math.ceil((entry.reset - now) / 1000); throw error }
}
