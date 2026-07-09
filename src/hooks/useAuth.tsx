import React, { createContext, use, useMemo, useCallback, useState, useEffect } from 'react';

type AuthState = {
  user: any | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({} as AuthState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial mock login state
    const timer = setTimeout(() => {
      setUser({ uid: 'mock-user-123' });
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(() => setUser({ uid: 'mock-user-123' }), []);
  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => use(AuthContext);
