import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUser(savedUser);
    }

    // Add interceptor to handle invalid token
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && 
            (error.response?.data?.msg === 'Token is not valid' || 
             error.response?.data?.msg === 'No token, authorization denied')) {
          logout();
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    setLoading(false);

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const login = async (phoneNumber, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { phoneNumber, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, msg: err.response?.data?.msg || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isAdmin: user?.role === 'admin', loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
