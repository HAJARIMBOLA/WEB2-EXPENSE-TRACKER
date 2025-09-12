// src/lib/apiClient.js
import axios from "axios";
import { getToken, clearToken } from "./storage";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

// attache le token si présent
api.interceptors.request.use((config) => {
  const t = getToken?.();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// nettoie le token sur 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) clearToken?.();
    return Promise.reject(err);
  }
);

// 👉 alias pour compatibilité avec tes imports existants
export const apiClient = api;
export default api;
