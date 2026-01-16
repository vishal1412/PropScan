import { useState, useEffect } from 'react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin@vishal';
const AUTH_STORAGE_KEY = 'admin-authenticated';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
};
