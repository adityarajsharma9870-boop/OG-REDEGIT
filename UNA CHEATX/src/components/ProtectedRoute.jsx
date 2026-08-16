import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuthContext';

/**
 * Protected route component
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
