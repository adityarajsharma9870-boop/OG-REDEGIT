import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const updateAuth = useCallback((newUser: any, newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }

    setUser(newUser);
    setToken(newToken);
  }, []);

  const API_URL = 'http://localhost:5000/api/auth';

  const signup = useCallback(async (email: string, password: string, firstName = '', lastName = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return {
        success: true,
        message: data.message,
        user: data.user,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.verified === false) {
          return {
            success: false,
            message: data.message,
            verified: false,
            email,
          };
        }
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        updateAuth(data.user, data.token);
      } else {
        setUser(data.user);
      }

      return {
        success: true,
        message: data.message,
        user: data.user,
        token: data.token,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Forgot password failed');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        localStorage.removeItem('authToken');
        setToken(null);
        return null;
      }

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (err) {
      return null;
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    getCurrentUser,
    updateAuth,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
