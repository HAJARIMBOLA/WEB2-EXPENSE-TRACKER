import { useEffect, useState } from "react";
import axios from "axios";

type UserProfile = {
  id: string;
  email: string;
  createdAt: string;
};

export default function Profile() {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [dark, setDark] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  // charger le profil
  useEffect(() => {
    const run = async () => {
      try {
        // 2 options possibles selon ton backend :
        // - /auth/me  (si tu l’as gardé)
        // - /user/profile (route fournie dans le backend)
        const urlBase = import.meta.env.VITE_API_URL;
        const res =
          (await axios.get(`${urlBase}/user/profile`, { withCredentials: true }))
          // fallback si /user/profile n’existe pas
          .catch(() => axios.get(`${urlBase}/auth/me`, { withCredentials: true }));

        const { data } = await res;
        setMe(data);
      } catch {
        setErr("Impossible de récupérer le profil.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // gérer dark mode (simple: toggle classe sur <html>)
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.removeItem("theme");
    }
  }, [dark]);

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      ).catch(() => {}); // si pas d’endpoint logout, on ignore
    } finally {
      // on redirige vers /login
      window.location.href = "/login";
    }
  };

  if (loading) return <div className="p-6">Chargement…</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      {err && <p className="text-red-600 mb-4">{err}</p>}

      {me && (
        <div className="rounded border p-4 bg-white dark:bg-zinc-900 dark:text-zinc-100">
          <div className="mb-2">
            <span className="font-medium">Email :</span> {me.email}
          </div>
          <div className="mb-4">
            <span className="font-medium">Créé le :</span>{" "}
            {new Date(me.createdAt).toLocaleString()}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
                className="accent-blue-600"
              />
              Mode sombre
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
