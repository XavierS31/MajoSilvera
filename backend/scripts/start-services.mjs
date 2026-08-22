import { existsSync, readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const backendDirectory = join(dirname(fileURLToPath(import.meta.url)), '..')
const environmentPath = join(backendDirectory, '.env')
const requiredKeys = ['DATABASE_URL', 'OAUTH2_CLIENT_ID', 'GEMINI_API_KEY', 'CALENDLY_API_TOKEN']

if (!existsSync(environmentPath)) {
  console.error('[Service Manager] Missing backend/.env.')
  process.exit(1)
}

const environment = Object.fromEntries(readFileSync(environmentPath, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const separator = line.indexOf('=')
    return separator === -1 ? [line, ''] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
  }))
const missingKeys = requiredKeys.filter((key) => !environment[key])
if (missingKeys.length) {
  console.error(`[Service Manager] backend/.env is missing required values: ${missingKeys.join(', ')}`)
  process.exit(1)
}

const mergedEnvironment = { ...process.env, ...environment, PORT: environment.NODE_API_PORT || '8000', CHATBOT_URL: 'http://127.0.0.1:8001' }
const childEnvironment = Object.entries(mergedEnvironment).reduce((normalized, [key, value]) => {
  const duplicate = Object.keys(normalized).find((existing) => existing.toLowerCase() === key.toLowerCase())
  if (duplicate) delete normalized[duplicate]
  normalized[key] = value
  return normalized
}, {})
const python = process.platform === 'win32' ? join(backendDirectory, 'chatbot', '.venv', 'Scripts', 'python.exe') : 'python3'
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const services = [
  { label: 'Node-API', command: npm, args: ['run', 'dev'], cwd: backendDirectory },
  { label: 'Python-Chatbot', command: python, args: ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8001', '--reload'], cwd: join(backendDirectory, 'chatbot') },
]

let stopping = false
const children = []
const prefix = (label, stream) => {
  let remainder = ''
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    const lines = `${remainder}${chunk}`.split(/\r?\n/)
    remainder = lines.pop() ?? ''
    for (const line of lines) if (line) console.log(`[${label}] ${line}`)
  })
  stream.on('end', () => { if (remainder) console.log(`[${label}] ${remainder}`) })
}

function stopAll(exitCode = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) {
    if (child.exitCode !== null || child.killed) continue
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    else child.kill('SIGTERM')
  }
  setTimeout(() => process.exit(exitCode), 350)
}

for (const service of services) {
  if (service.label === 'Python-Chatbot' && process.platform === 'win32' && !existsSync(service.command)) {
    console.error('[Service Manager] Missing chatbot virtual environment. Create backend/chatbot/.venv first.')
    stopAll(1)
    break
  }
  const child = spawn(service.command, service.args, { cwd: service.cwd, env: childEnvironment, shell: process.platform === 'win32' && service.command === npm, stdio: ['ignore', 'pipe', 'pipe'] })
  children.push(child)
  prefix(service.label, child.stdout)
  prefix(service.label, child.stderr)
  child.on('error', (error) => { console.error(`[${service.label}] ${error.message}`); stopAll(1) })
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`[${service.label}] stopped unexpectedly (${signal ?? `exit code ${code ?? 1}`}).`)
      stopAll(code === 0 ? 1 : (code ?? 1))
    }
  })
}

process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))
