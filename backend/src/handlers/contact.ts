import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { parseBody, safeText } from '../middleware/sanitize.js'
import { database } from '../utils/database.js'

const schema = z.object({ name: safeText(100), email: z.string().trim().email().max(254), phone: safeText(30), message: safeText(2500) })
const ses = new SESClient({})
export async function contact(event: ApiEvent) {
  const data = parseBody(event, schema); const from = process.env.SES_FROM_EMAIL; const to = process.env.SES_TO_EMAIL
  await database().query('INSERT INTO contact_messages (name, email, phone, message) VALUES ($1, $2, $3, $4)', [data.name, data.email, data.phone, data.message])
  if (from && to) await ses.send(new SendEmailCommand({ Source: from, Destination: { ToAddresses: [to] }, ReplyToAddresses: [data.email], Message: { Subject: { Data: `Nuevo contacto web: ${data.name}`, Charset: 'UTF-8' }, Body: { Text: { Data: `Nombre: ${data.name}\nCorreo: ${data.email}\nTeléfono: ${data.phone}\n\nMensaje:\n${data.message}`, Charset: 'UTF-8' } } } }))
  return { ok: true, message: 'Mensaje enviado.' }
}
