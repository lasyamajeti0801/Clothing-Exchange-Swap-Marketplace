import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('rewear_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
          } else {
            localStorage.removeItem('rewear_token');
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          localStorage.removeItem('rewear_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data?.data) {
      const { user, token } = res.data.data;
      localStorage.setItem('rewear_token', token);
      setUser(user);
      return user;
    }
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res.data?.data) {
      const { user, token } = res.data.data;
      localStorage.setItem('rewear_token', token);
      setUser(user);
      return user;
    }
  };

  const logout = () => {
    localStorage.removeItem('rewear_token');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
