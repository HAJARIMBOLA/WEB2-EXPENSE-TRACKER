import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex: http://localhost:4000/api
  withCredentials: true,
});


// ← AJOUTEZ CET INTERCEPTEUR POUR ENVOYER LE TOKEN
api.interceptors.request.use((cfg) => {
  console.log("[DEBUG] localStorage token:", localStorage.getItem('token')); // ← AJOUTEZ
  const token = localStorage.getItem('token');
if (token) {
  cfg.headers.Authorization = `Bearer ${token}`;
  console.log("[TOKEN] Added to request: Bearer " + token.substring(0, 20) + "...");
}
 else {
    console.log("[TOKEN] No token found!"); // ← AJOUTEZ
  }
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
