import { z, type ZodType } from 'zod'
import type { ApiEvent } from '../types.js'

export function parseBody<T>(event: ApiEvent, schema: ZodType<T>): T {
  let raw: unknown
  try { raw = event.body ? JSON.parse(event.body) : {} } catch { throw new Error('INVALID_JSON') }
  const result = schema.safeParse(raw)
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'INVALID_INPUT')
  return result.data
}

export const safeText = (max: number) => z.string().trim().min(1).max(max).transform((value) => value.replace(/[<>]/g, ''))
