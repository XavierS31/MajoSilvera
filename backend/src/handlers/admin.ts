import { database } from '../utils/database.js'

export async function listMessages() {
  const result = await database().query('SELECT id, name, email, phone, message, created_at FROM contact_messages ORDER BY created_at DESC')
  return { messages: result.rows }
}
