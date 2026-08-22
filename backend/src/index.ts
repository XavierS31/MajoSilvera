import type { Handler } from 'aws-lambda'
import type { ApiEvent, ApiResult } from './types.js'
import { assertRateLimit } from './middleware/rateLimiter.js'
import { requireAdmin } from './middleware/authCheck.js'
import { chat } from './handlers/chat.js'
import { adminCatalog, createPackage, createService, deletePackage, deleteService, listPackages, listServices, updatePackage, updateService } from './handlers/catalog.js'
import { listMessages } from './handlers/admin.js'
import { scheduleCalendly } from './handlers/calendly.js'
import { contact } from './handlers/contact.js'

const allowedOrigins = new Set(['https://majosilvera.com', 'https://www.majosilvera.com', 'https://fisioesthetic.com', 'https://www.fisioesthetic.com', 'http://localhost:5173'])
const corsFor = (event: ApiEvent) => { const origin = event.headers.origin; return { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': origin && allowedOrigins.has(origin) ? origin : 'https://majosilvera.com', 'access-control-allow-headers': 'content-type,authorization', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS', vary: 'origin' } }
const statusFor = (error: unknown) => { const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'; if (code === 'RATE_LIMITED') return 429; if (code === 'UNAUTHORIZED') return 401; if (code === 'FORBIDDEN') return 403; if (code.startsWith('INVALID_') || code === 'INVALID_JSON') return 400; if (code === 'AI_UNAVAILABLE' || code === 'OAUTH_UNAVAILABLE' || code.endsWith('_UNAVAILABLE')) return 503; return 500 }
const humanMessage = (error: unknown) => { const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'; const messages: Record<string, string> = { RATE_LIMITED: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.', FORBIDDEN: 'No tienes autorización para esta acción.', UNAUTHORIZED: 'Inicia sesión para continuar.', INVALID_JSON: 'Los datos enviados no son válidos.', AI_UNAVAILABLE: 'El asistente no está disponible en este momento.' }; return messages[code] || (code.startsWith('INVALID_') ? 'Revisa los datos enviados.' : 'No fue posible completar la solicitud.') }
const json = (event: ApiEvent, statusCode: number, body: unknown, headers: Record<string, string> = {}): ApiResult => ({ statusCode, headers: { ...corsFor(event), ...headers }, body: JSON.stringify(body) })

export const handler: Handler<ApiEvent, ApiResult> = async (event) => {
  if (event.requestContext.http.method === 'OPTIONS') return { statusCode: 204, headers: corsFor(event) }
  const path = event.rawPath.replace(/^\/api\/v1/, ''); const method = event.requestContext.http.method
  try {
    const isChat = path === '/ai/chat'; assertRateLimit(event, isChat ? 'chat' : 'api', isChat ? Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10) : 60, isChat ? Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10) : 60_000)
    if (method === 'POST' && path === '/ai/chat') return json(event, 200, await chat(event))
    if (method === 'GET' && path === '/services') return json(event, 200, await listServices())
    if (method === 'GET' && path === '/packages') return json(event, 200, await listPackages())
    if (method === 'GET' && path === '/admin/messages') { await requireAdmin(event); return json(event, 200, await listMessages()) }
    if (method === 'GET' && path === '/admin/services-packages') { await requireAdmin(event); return json(event, 200, await adminCatalog()) }
    if (method === 'POST' && path === '/admin/services') { await requireAdmin(event); return json(event, 201, await createService(event)) }
    if (method === 'POST' && path === '/admin/packages') { await requireAdmin(event); return json(event, 201, await createPackage(event)) }
    if (method === 'PUT' && /^\/admin\/services\/[^/]+$/.test(path)) { await requireAdmin(event); return json(event, 200, await updateService(event)) }
    if (method === 'PUT' && /^\/admin\/packages\/[^/]+$/.test(path)) { await requireAdmin(event); return json(event, 200, await updatePackage(event)) }
    if (method === 'DELETE' && /^\/admin\/services\/[^/]+$/.test(path)) { await requireAdmin(event); return json(event, 200, await deleteService(event)) }
    if (method === 'DELETE' && /^\/admin\/packages\/[^/]+$/.test(path)) { await requireAdmin(event); return json(event, 200, await deletePackage(event)) }
    if (method === 'POST' && path === '/booking/calendly') return json(event, 200, await scheduleCalendly(event))
    if (method === 'POST' && path === '/contact') return json(event, 200, await contact(event))
    return json(event, 404, { message: 'Ruta no encontrada.' })
  } catch (error) { const retryAfter = error as Error & { retryAfter?: number }; return json(event, statusFor(error), { message: humanMessage(error) }, retryAfter.retryAfter ? { 'retry-after': String(retryAfter.retryAfter) } : {}) }
}
