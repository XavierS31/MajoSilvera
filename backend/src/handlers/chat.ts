import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { parseBody, safeText } from '../middleware/sanitize.js'
import { askGemini } from '../utils/geminiClient.js'

const schema = z.object({ message: safeText(1500) })
export async function chat(event: ApiEvent) { const { message } = parseBody(event, schema); return { reply: await askGemini(message) } }
