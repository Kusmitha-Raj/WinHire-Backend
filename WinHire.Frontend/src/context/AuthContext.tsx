import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/authApi';
import { setAuth, removeAuth } from '../api/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithMicrosoft: (accessToken: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    setAuth(response.token);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const loginWithMicrosoft = async (accessToken: string) => {
    const response = await authAPI.microsoftLogin(accessToken);
    setAuth(response.token);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    removeAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithMicrosoft, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
