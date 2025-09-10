import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex: http://localhost:4000/api
  withCredentials: true,
});

// logs utiles
api.interceptors.request.use((cfg) => {
  console.log("[API] →", cfg.method?.toUpperCase(), cfg.baseURL + (cfg.url ?? ""));
  return cfg;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API] ←", err.response?.status, err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
