import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get(`${process.env.API_URL}/auth/profile`);
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password, rememberMe) => {
    try {
      const res = await axios.post(`${process.env.API_URL}/auth/login`, { email, password, rememberMe });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Fetch user profile after login
      const profileRes = await axios.get(`${process.env.API_URL}/auth/profile`);
      setUser(profileRes.data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${process.env.API_URL}/auth/profile`, profileData);
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
