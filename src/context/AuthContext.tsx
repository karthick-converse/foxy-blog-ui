"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../interface/User";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser?.email || !parsedUser?.role) {
        throw new Error("Invalid user shape");
      }

      setToken(storedToken);
      setUser(parsedUser);
    } catch (err) {
      localStorage.clear();
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = (token: string, user: User) => {
    if (!user) {
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
