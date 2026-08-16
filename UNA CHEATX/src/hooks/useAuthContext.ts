import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext.tsx';

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext<any>(AuthContext);

  // If provider isn't mounted (SSR or ordering issue), return a safe empty object
  // to avoid throwing during render — callers should handle missing properties.
  return context ?? {};
}
