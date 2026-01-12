import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On refresh, just check token presence
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    if (token) {
      // We trust backend to validate token on API calls
      setUser({ loggedIn: true });
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    // Backend returns token
    localStorage.setItem('token', res.data.token);

    // Minimal user state (backend is source of truth)
    setUser({ loggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
