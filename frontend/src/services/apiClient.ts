const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export class ApiError extends Error { constructor(message: string, public status: number) { super(message) } }

export async function apiClient<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  const data = await response.json().catch(() => ({})) as { message?: string } & T
  if (!response.ok) throw new ApiError(data.message || 'No fue posible completar la solicitud.', response.status)
  return data
}
