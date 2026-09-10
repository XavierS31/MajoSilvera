import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { parseBody, safeText } from '../middleware/sanitize.js'
import { database } from '../utils/database.js'

const schema = z.object({ name: safeText(100), email: z.string().trim().email().max(254), phone: safeText(30), message: safeText(2500) })

/** Saves website contact submissions in PostgreSQL. */
export async function contact(event: ApiEvent) {
  const data = parseBody(event, schema)
  await database().query('INSERT INTO contact_messages (name, email, phone, message) VALUES ($1, $2, $3, $4)', [data.name, data.email, data.phone, data.message])
  return { ok: true, message: 'Mensaje enviado.' }
}
