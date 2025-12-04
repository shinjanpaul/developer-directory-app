// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider
 * - stores token & user in localStorage immediately on signIn
 * - keeps a lastSignInAt timestamp (ms) to prevent immediate sign-out after login
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  // store last sign-in time to avoid accidental immediate sign-out on race
  const [lastSignInAt, setLastSignInAt] = useState(() => {
    const raw = localStorage.getItem('lastSignInAt');
    return raw ? Number(raw) : 0;
  });

  const signIn = ({ token: t, user: u }) => {
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    }
    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
    }

    const now = Date.now();
    localStorage.setItem('lastSignInAt', String(now));
    setLastSignInAt(now);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastSignInAt');
    setToken(null);
    setUser(null);
    setLastSignInAt(0);
  };

  return (
    <AuthContext.Provider value={{ user, token, lastSignInAt, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
