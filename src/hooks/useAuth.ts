import { useState, useEffect } from 'react';

type AuthState = {
  user: any | null;
  loading: boolean;
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock successful login immediately to bypass Firebase for now
    const timer = setTimeout(() => {
      setUser({ uid: 'mock-user-123' });
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
};
