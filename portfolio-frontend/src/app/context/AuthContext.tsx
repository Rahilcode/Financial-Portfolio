"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken, parseJwt, setToken } from "../lib/auth";
import api from "../lib/api";

type User = { username: string } | null;

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload: any = parseJwt(token);
      if (payload?.sub) setUser({ username: payload.sub });
      else {
        clearToken();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password });
    const token = res.data?.token ?? res.data;
    if (!token) throw new Error("No token received");

    setToken(token);
    const payload: any = parseJwt(token);
    setUser(payload?.sub ? { username: payload.sub } : { username });
    router.push("/dashboard");
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
