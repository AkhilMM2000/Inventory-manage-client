import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, loginUser, logout as apiLogout } from "../api/auth";
import { setAccessToken as setAxiosToken, setTokenListener } from "../api/axiosInstance";
import type { TokenPayload } from "../types/user";
import toast from "react-hot-toast";

interface AuthContextType {
  user: TokenPayload | null;
  loading: boolean;
  accessToken: string | null;
  login: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state when the axios interceptor refreshes the token in the background
  useEffect(() => {
    setTokenListener((token) => {
      setAccessTokenState(token);
    });
  }, []);

  console.log("🔑 Current Access Token (State):", accessToken);

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    setAxiosToken(token);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (payload: any) => {
    try {
      const { accessToken: token, user: userData } = await loginUser(payload);
      setAccessToken(token);
      setUser(userData);
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setAccessToken(null);
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed");
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        logout,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
