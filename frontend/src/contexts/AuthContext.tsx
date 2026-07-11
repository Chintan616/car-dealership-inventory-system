import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Decode token to check expiration and extract user info
          const decoded: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token');
          } else {
            // Note: Since our backend login route returns the user object, but we
            // might just be refreshing the page, we extract id/role from the JWT.
            // Ideally the backend has a /me route to fetch fresh user data.
            // We'll stub the name/email for now, or decode if we add it to the JWT payload in the future.
            setToken(storedToken);
            setUser({
              id: decoded.id,
              role: decoded.role,
              email: decoded.email || '',
              name: decoded.name || '',
            });
          }
        } catch (error) {
          console.error('Failed to decode token', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for the custom auth-error event dispatched by axios interceptor
    const handleAuthError = () => logout();
    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
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
