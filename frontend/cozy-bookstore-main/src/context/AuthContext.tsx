import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "@/services/api";

interface AuthContextType {
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthContextType["user"]) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Define checkAuth function FIRST before using it
  const checkAuth = async () => {
    try {
      const response = await authAPI.checkAuth();

      // Normalize possible response shapes: { success, authenticated, user },
      // { success, data: { user } }, { data: { user } }, or { user: {...} }
      const userData = response?.user ?? response?.data?.user ?? response?.data ?? null;
      const authenticated = Boolean(response?.success && userData);

      if (authenticated) {
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }

      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      // User is not authenticated - this is expected for first-time visitors
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newUser: AuthContextType["user"]) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
