import { createServer } from 'node:http'
import { handler } from './index.js'
import type { ApiEvent } from './types.js'

const port = Number.parseInt(process.env.PORT || '8000', 10)
const server = createServer(async (request, response) => {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  const headers = Object.fromEntries(Object.entries(request.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value || '']))
  const event = {
    version: '2.0', routeKey: '$default', rawPath: request.url?.split('?')[0] || '/', rawQueryString: request.url?.split('?')[1] || '',
    headers, requestContext: { accountId: '', apiId: 'local', domainName: 'localhost', domainPrefix: 'local', http: { method: request.method || 'GET', path: request.url || '/', protocol: 'HTTP/1.1', sourceIp: '127.0.0.1', userAgent: headers['user-agent'] }, requestId: crypto.randomUUID(), routeKey: '$default', stage: '$default', time: '', timeEpoch: Date.now() },
    isBase64Encoded: false, body: chunks.length ? Buffer.concat(chunks).toString('utf8') : undefined,
  } as ApiEvent
  const result = await handler(event, {} as never, () => undefined)
  if (!result || typeof result === 'string') {
    response.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ message: 'No fue posible completar la solicitud.' }))
    return
  }
  const responseHeaders = Object.fromEntries(Object.entries(result.headers || {}).map(([name, value]) => [name, String(value)]))
  response.writeHead(result.statusCode || 500, responseHeaders)
  response.end(result.body)
})

server.listen(port, '127.0.0.1', () => console.log(`Local API listening at http://127.0.0.1:${port}/api/v1`))
