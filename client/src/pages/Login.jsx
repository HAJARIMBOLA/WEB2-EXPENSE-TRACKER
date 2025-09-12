import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form.email, form.password);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"></div>
        
        <form 
          onSubmit={submit} 
          className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300"
        >
          <h1 className="text-2xl font-bold mb-6 text-white text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Connexion
          </h1>
          
          {err && (
            <div className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              {err}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative group">
              <input 
                className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:border-blue-400 focus:bg-white/10 group-hover:border-white/40 focus:shadow-blue-glow"
                placeholder="Email"
                value={form.email}
                onChange={e=>setForm(f=>({...f, email: e.target.value}))}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10 blur-sm"></div>
            </div>
            
            <div className="relative group">
              <input 
                className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:border-blue-400 focus:bg-white/10 group-hover:border-white/40 focus:shadow-blue-glow"
                type="password" 
                placeholder="Mot de passe"
                value={form.password}
                onChange={e=>setForm(f=>({...f, password: e.target.value}))}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10 blur-sm"></div>
            </div>
          </div>
          
          <button className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-button-glow hover:scale-105 active:scale-95 border border-white/20">
            Se connecter
          </button>
          
          <div className="text-sm mt-4 text-center text-white/70">
            Pas de compte ?{" "}
            <Link 
              to="/signup" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium hover:underline"
            >
              S'inscrire
            </Link>
          </div>
          
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full blur-sm opacity-60 animate-pulse"></div>
          <div className="absolute -top-1 -right-3 w-2 h-2 bg-purple-400 rounded-full blur-sm opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-2 -left-3 w-3 h-3 bg-pink-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-1 -right-2 w-2 h-2 bg-blue-300 rounded-full blur-sm opacity-30 animate-pulse"></div>
        </form>
      </div>
      
      <style jsx>{`
        .focus\\:shadow-blue-glow:focus {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        .hover\\:shadow-button-glow:hover {
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
}