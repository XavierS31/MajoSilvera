import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { parseBody, safeText } from '../middleware/sanitize.js'
import { database } from '../utils/database.js'
import { cacheKeys, clearCatalogCache, getCached, setCached } from '../utils/cache.js'

const idSchema = z.string().uuid()
const serviceSchema = z.object({ title: safeText(160).optional(), description: safeText(3000).optional(), category: safeText(100).optional(), price: z.coerce.number().nonnegative().max(100_000_000).optional() }).refine((value) => Object.keys(value).length > 0, 'INVALID_SERVICE_UPDATE')
const packageSchema = z.object({ title: safeText(160).optional(), details: safeText(5000).optional(), price: z.coerce.number().nonnegative().max(100_000_000).optional() }).refine((value) => Object.keys(value).length > 0, 'INVALID_PACKAGE_UPDATE')
const serviceCreateSchema = z.object({ title: safeText(160), description: safeText(3000), category: safeText(100), price: z.coerce.number().nonnegative().max(100_000_000) })
const packageCreateSchema = z.object({ title: safeText(160), details: safeText(5000), price: z.coerce.number().nonnegative().max(100_000_000) })
async function cached<T>(key: string, load: () => Promise<T>) { return getCached<T>(key) ?? setCached(key, await load()) }
export async function listServices() { return cached(cacheKeys.services, async () => ({ services: (await database().query('SELECT id, title, description, category, price, updated_at FROM services ORDER BY category, title')).rows })) }
export async function listPackages() { return cached(cacheKeys.packages, async () => ({ packages: (await database().query('SELECT id, title, details, price, updated_at FROM packages ORDER BY title')).rows })) }
export async function adminCatalog() { return cached(cacheKeys.adminCatalog, async () => ({ services: (await database().query('SELECT id, title, description, category, price, updated_at FROM services ORDER BY category, title')).rows, packages: (await database().query('SELECT id, title, details, price, updated_at FROM packages ORDER BY title')).rows })) }
async function update(table: 'services' | 'packages', id: string, values: Record<string, string | number>) {
  const keys = Object.keys(values); const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')
  const result = await database().query(`UPDATE ${table} SET ${assignments}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`, [...keys.map((key) => values[key]), id])
  if (!result.rowCount) throw new Error(table === 'services' ? 'SERVICE_NOT_FOUND' : 'PACKAGE_NOT_FOUND')
  clearCatalogCache(); return { [table === 'services' ? 'service' : 'package']: result.rows[0] }
}
export async function updateService(event: ApiEvent) { const id = idSchema.safeParse(event.pathParameters?.id); if (!id.success) throw new Error('INVALID_SERVICE_ID'); return update('services', id.data, parseBody(event, serviceSchema)) }
export async function updatePackage(event: ApiEvent) { const id = idSchema.safeParse(event.pathParameters?.id); if (!id.success) throw new Error('INVALID_PACKAGE_ID'); return update('packages', id.data, parseBody(event, packageSchema)) }
export async function createService(event: ApiEvent) { const value = parseBody(event, serviceCreateSchema); const result = await database().query('INSERT INTO services (title, description, category, price) VALUES ($1, $2, $3, $4) RETURNING *', [value.title, value.description, value.category, value.price]); clearCatalogCache(); return { service: result.rows[0] } }
export async function createPackage(event: ApiEvent) { const value = parseBody(event, packageCreateSchema); const result = await database().query('INSERT INTO packages (title, details, price) VALUES ($1, $2, $3) RETURNING *', [value.title, value.details, value.price]); clearCatalogCache(); return { package: result.rows[0] } }
async function remove(table: 'services' | 'packages', event: ApiEvent) { const id = idSchema.safeParse(event.pathParameters?.id); if (!id.success) throw new Error('INVALID_CATALOG_ID'); const result = await database().query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [id.data]); if (!result.rowCount) throw new Error('CATALOG_ITEM_NOT_FOUND'); clearCatalogCache(); return { ok: true } }
export const deleteService = (event: ApiEvent) => remove('services', event)
export const deletePackage = (event: ApiEvent) => remove('packages', event)
