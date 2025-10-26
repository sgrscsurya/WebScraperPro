import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token and get user data
          // This would typically be an API call
          const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data - replace with actual API call
      const userData: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        plan: 'free'
      };

      setUser(userData);
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data - replace with actual API call
      const userData: User = {
        id: '1',
        email,
        name,
        plan: 'free'
      };

      setUser(userData);
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const forgotPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate password reset email sent
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate password reset
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};