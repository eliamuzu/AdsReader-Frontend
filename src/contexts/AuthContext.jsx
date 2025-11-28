import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Set the token in the Authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Call the backend to validate the token
          const response = await api.get('/auth/validate-token');
          console.log('Token validation response:', response.data);

          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('access_token'); // Remove invalid token
          setIsAuthenticated(false);
        }
      }
      setLoading(false); // Set loading to false after validation
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      const { access_token } = response.data;

      // Save the token in localStorage
      localStorage.setItem('access_token', access_token);

      // Set the token in the Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

