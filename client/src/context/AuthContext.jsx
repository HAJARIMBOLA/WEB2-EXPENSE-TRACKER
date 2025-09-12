import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/apiClient";
import { getToken, setToken, clearToken } from "../lib/storage";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (!t) { setReady(true); return; }
    api.get("/api/auth/me")
      .then(({ data }) => { setUser(data); setReady(true); })
      .catch(() => { clearToken(); setReady(true); });
  }, []);

  const value = useMemo(() => ({
    user,
    login: async (email, password) => {
      const { data } = await api.post("/api/auth/login", { email, password });
      setToken(data.token);
      const me = await api.get("/api/auth/me");
      setUser(me.data);
    },
    signup: async (email, password) => {
      const { data } = await api.post("/api/auth/signup", { email, password });
      setToken(data.token);
      const me = await api.get("/api/auth/me");
      setUser(me.data);
    },
    logout: () => { clearToken(); setUser(null); }
  }), [user]);

  if (!ready) return null;
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
