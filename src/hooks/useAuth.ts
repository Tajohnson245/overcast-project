'use client';

/**
 * useAuth Hook
 * 
 * Manages instructor authentication state and provides
 * login, logout, and verify functions.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { 
  userAtom, 
  setAuthenticatedAtom, 
  resetUserAtom 
} from '@/store/user';
import type { LoginRequest, LoginResponse, AuthVerifyResponse } from '@/types';

interface UseAuthReturn {
  /** Current user state */
  user: typeof userAtom extends { init: infer T } ? T : never;
  /** Whether the user is authenticated as instructor */
  isAuthenticated: boolean;
  /** Current mode (student/instructor) */
  mode: 'student' | 'instructor';
  /** Whether auth check is in progress */
  isLoading: boolean;
  /** Login error message */
  error: string | null;
  /** Login with credentials */
  login: (username: string, password: string) => Promise<boolean>;
  /** Logout and return to student mode */
  logout: () => Promise<void>;
  /** Verify current session */
  verify: () => Promise<boolean>;
  /** Clear any error */
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useAtom(userAtom);
  const setAuthenticated = useSetAtom(setAuthenticatedAtom);
  const resetUser = useSetAtom(resetUserAtom);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVerified, setHasVerified] = useState(false);
  
  /**
   * Login with username and password.
   */
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password } as LoginRequest),
      });
      
      const data: LoginResponse = await response.json();
      
      if (!response.ok || !data.success) {
        setError(data.error || 'Login failed');
        return false;
      }
      
      // Update state to instructor mode
      setAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setAuthenticated]);
  
  /**
   * Logout and return to student mode.
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always reset to student mode, even if API call fails
      resetUser();
      setIsLoading(false);
    }
  }, [resetUser]);
  
  /**
   * Verify current session status.
   * Checks the HTTP-only cookie to restore instructor mode on page load/refresh.
   */
  const verify = useCallback(async (): Promise<boolean> => {
    // Prevent duplicate verification calls
    if (hasVerified) {
      return user.isAuthenticated;
    }
    
    try {
      const response = await fetch('/api/auth/verify');
      const data: AuthVerifyResponse = await response.json();
      
      setHasVerified(true);
      
      if (data.isAuthenticated) {
        setAuthenticated(true);
        return true;
      } else {
        // Ensure state reflects unauthenticated
        if (user.isAuthenticated) {
          resetUser();
        }
        return false;
      }
    } catch (err) {
      console.error('Verify error:', err);
      setHasVerified(true);
      return false;
    }
  }, [setAuthenticated, resetUser, user.isAuthenticated, hasVerified]);
  
  /**
   * Clear error state.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    user,
    isAuthenticated: user.isAuthenticated,
    mode: user.mode,
    isLoading,
    error,
    login,
    logout,
    verify,
    clearError,
  };
}

