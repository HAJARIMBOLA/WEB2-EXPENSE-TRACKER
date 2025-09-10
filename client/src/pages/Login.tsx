import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../service/api"; // <= vérifie bien le chemin
import { useAuth } from "../store/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();                      // IMPORTANT
    setError(null);

    // diagnostic rapide
    console.log("[LOGIN] email:", email, "len", email.length, "| pwd len", password.length);

try {
  setLoading(true);
  const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
  console.log("[LOGIN ok]", res.data);

      // AJOUTEZ CES 4 LIGNES ICI :
  if (res.data.accessToken) {
    localStorage.setItem("token", res.data.accessToken);
    console.log("[TOKEN SAVED]", res.data.accessToken);

    // Mets-le dans ton Zustand aussi
    useAuth.getState().setToken(res.data.accessToken);
  } else {
    console.error("[LOGIN] Pas de accessToken dans la réponse !");
  }

      nav("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
      console.error("[LOGIN error]", err?.response?.status, msg, err?.response?.data);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Expense Tracker Login</h1>

        {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-4">{error}</div>}

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}                  // relié au state
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}               // relié au state
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold rounded py-2 disabled:opacity-60"
        >
          {loading ? "..." : "Login"}
        </button>

        <div className="text-center mt-4 text-sm">
          Don’t have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
