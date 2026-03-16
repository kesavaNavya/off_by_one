'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS = {
  'doctor@example.com': {
    id: 'user_demo',
    email: 'doctor@example.com',
    password: '123456',
    name: 'Dr. John Smith',
    role: 'doctor',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Load auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      localStorage.removeItem('auth_user');
    } finally {
      setLoading(false);
      setMounted(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];

    if (!demoUser || demoUser.password !== password) {
      throw new Error('Invalid email or password');
    }

    const userData: User = {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
    };

    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
    
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      router.push('/dashboard');
    }, 0);
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      router.push('/');
    }, 0);
  };

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        loading: !mounted || loading,
        login,
        logout,
        isAuthenticated: mounted && !!user,
      }}
    >
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
