/**
 * useAuth — React hook for the Pirates Softball authentication system
 *
 * Wraps the auth.js functions in React state so components re-render
 * when auth state changes. Also listens for storage events so that
 * multi-tab sessions stay in sync.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  getAuthState,
  getCurrentRole,
  isAuthenticated as checkAuth,
  hasPermission as checkPermission,
  loginCoach,
  loginWithPlayerCode,
  logout as doLogout,
} from '@app/auth';

export default function useAuth() {
  const [authState, setAuthState] = useState(() => getAuthState());

  // Re-sync if another tab changes auth (storage event)
  useEffect(() => {
    const handler = (e) => {
      if (e.key && e.key.includes('pirates-auth')) {
        setAuthState(getAuthState());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const role = authState ? authState.role : null;
  const authenticated = authState !== null;
  const playerId = authState ? authState.playerId : null;
  const playerName = authState ? authState.playerName : null;

  const login = useCallback((type, credential, players) => {
    let result;
    if (type === 'head_coach' || type === 'assistant') {
      result = loginCoach(credential, type);
    } else {
      // parent or player
      result = loginWithPlayerCode(credential, players, type);
    }
    if (result.success) {
      setAuthState(getAuthState());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setAuthState(null);
  }, []);

  const hasPermission = useCallback(
    (module, action = 'read') => {
      return checkPermission(module, action, role);
    },
    [role],
  );

  return {
    role,
    isAuthenticated: authenticated,
    playerId,
    playerName,
    login,
    logout,
    hasPermission,
    authState,
  };
}
