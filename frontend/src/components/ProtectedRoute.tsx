import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '@/services/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation(); const session = getSession()
  if (!session || new Date(session.expiresAt) <= new Date()) return <Navigate to="/" replace state={{ from: location.pathname }}/>
  return <>{children}</>
}
