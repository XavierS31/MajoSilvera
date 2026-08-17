import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { supabaseClient } from '../utils/supabaseClient.js'

const idSchema = z.string().uuid()
let serviceCache: { expiresAt: number; value: unknown[] } | null = null
export function clearServicesCache() { serviceCache = null }
export async function listServices() {
  if (serviceCache && serviceCache.expiresAt > Date.now()) return { services: serviceCache.value, cached: true }
  const { data, error } = await supabaseClient().from('services').select('id,name,description,price,category,active').eq('active', true).order('category').order('name')
  if (error) throw new Error('SERVICES_UNAVAILABLE')
  serviceCache = { value: data || [], expiresAt: Date.now() + 5 * 60_000 }
  return { services: serviceCache.value, cached: false }
}
export async function deleteService(event: ApiEvent) {
  const id = idSchema.safeParse(event.pathParameters?.id)
  if (!id.success) throw new Error('INVALID_SERVICE_ID')
  const { error } = await supabaseClient().from('services').update({ active: false, deleted_at: new Date().toISOString() } as never).eq('id', id.data)
  if (error) throw new Error('SERVICE_UPDATE_FAILED')
  clearServicesCache()
  return { ok: true }
}
