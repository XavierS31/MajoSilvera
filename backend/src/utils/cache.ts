import NodeCache from 'node-cache'

const configuredTtl = Number.parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10)
const cache = new NodeCache({ stdTTL: Number.isFinite(configuredTtl) && configuredTtl > 0 ? configuredTtl : 3600, useClones: false })
export const cacheKeys = { services: 'public:services', packages: 'public:packages', adminCatalog: 'admin:services-packages' }
export function clearCatalogCache() { cache.del(Object.values(cacheKeys)) }
export function getCached<T>(key: string) { return cache.get<T>(key) }
export function setCached<T>(key: string, value: T) { cache.set(key, value); return value }
