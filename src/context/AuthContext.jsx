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
      // Ideally verify token here with a /me endpoint
      // For now, assume it's valid if present
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUser(savedUser);
    }
    setLoading(false);
  }, [token]);

  const login = async (phoneNumber, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { phoneNumber, password });
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
