import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { parseBody, safeText } from '../middleware/sanitize.js'

const schema = z.object({ name: safeText(100), email: z.string().trim().email().max(254), phone: safeText(30), service: z.enum(['fisioterapia', 'estetica', 'regenerativos', 'capilar', 'bienestar']), notes: z.string().trim().max(1000).optional().default('') })
export function calendlyConfiguration() {
  const schedulingUrl = process.env.CALENDLY_SCHEDULING_URL
  if (!schedulingUrl || !/^https:\/\/calendly\.com\//.test(schedulingUrl)) throw new Error('SERVER_MISCONFIGURED')
  return { schedulingUrl }
}
export async function scheduleCalendly(event: ApiEvent) {
  const booking = parseBody(event, schema); const { schedulingUrl } = calendlyConfiguration()
  const url = new URL(schedulingUrl); url.searchParams.set('name', booking.name); url.searchParams.set('email', booking.email); url.searchParams.set('a1', booking.service)
  return { schedulingUrl: url.toString() }
}
