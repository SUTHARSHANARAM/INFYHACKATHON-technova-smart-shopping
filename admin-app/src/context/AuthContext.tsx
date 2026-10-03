import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { adminService } from '../services/adminService';

interface AuthContextType {
  adminUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('technova_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('technova_admin_token') || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (token) {
        try {
          const res = await adminService.getMe();
          if (res.data.role !== 'ADMIN') {
            throw new Error('Customer account detected. Admin role required.');
          }
          setAdminUser(res.data);
          localStorage.setItem('technova_admin_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Admin auth verification failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };
    verifyAdmin();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await adminService.login({ email, password });
    const { user: userData, token: jwtToken } = res.data;

    if (userData.role !== 'ADMIN') {
      throw new Error('Access Denied: This portal requires an ADMIN account.');
    }

    setAdminUser(userData);
    setToken(jwtToken);
    localStorage.setItem('technova_admin_token', jwtToken);
    localStorage.setItem('technova_admin_user', JSON.stringify(userData));
  };

  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('technova_admin_token');
    localStorage.removeItem('technova_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!adminUser && !!token && adminUser.role === 'ADMIN',
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};
