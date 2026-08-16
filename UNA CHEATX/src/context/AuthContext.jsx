import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAuth = useCallback((newUser, newToken) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }

    if (newUser) {
      localStorage.setItem('admin_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('admin_user');
    }

    setUser(newUser);
    setToken(newToken);
  }, []);

  const API_URL = 'http://localhost:5000/api/auth';

  /**
   * Signup function
   */
  const signup = useCallback(async (email, password, firstName = '', lastName = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
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
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login function
   */
  const login = useCallback(async (email, password) => {
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

      // Store token and user
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
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Clear token and user
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setError(null);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verify email function
   */
  const verifyEmail = useCallback(async (token) => {
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
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Forgot password function
   */
  const forgotPassword = useCallback(async (email) => {
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
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset password function
   */
  const resetPassword = useCallback(async (token, password) => {
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
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resend verification email
   */
  const resendVerificationEmail = useCallback(async (email) => {
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
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get current user
   */
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
        // Token invalid or expired
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
