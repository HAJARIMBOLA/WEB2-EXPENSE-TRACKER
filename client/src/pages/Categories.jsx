import { useEffect, useState } from "react";
import { api } from "../lib/apiClient.js";

export default function Categories() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", type: "EXPENSE" });

  const load = async ()=> {
    const { data } = await api.get("/api/categories");
    setList(data);
  };
  useEffect(()=>{ load(); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    await api.post("/api/categories", form);
    setForm({ name: "", type: form.type });
    load();
  };
  const del = async (id)=>{ await api.delete(`/api/categories/${id}`); load(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900 p-6 relative">
      {/* Effets d'arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/6 w-64 h-64 bg-red-400 rounded-full blur-3xl"></div>
      </div>
      
      {/* Texture subtile */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-red-400 bg-clip-text text-transparent">
            Catégories
          </h1>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="text-xs text-gray-400 font-medium">Gestion</div>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <form onSubmit={submit} className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <input 
                  className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:border-amber-400 focus:bg-white/10 group-hover:border-white/30 focus:shadow-amber-glow"
                  placeholder="Nom de la catégorie"
                  value={form.name} 
                  onChange={e=>setForm(f=>({...f, name:e.target.value}))}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10 blur-sm"></div>
              </div>
              
              <div className="relative group">
                <select 
                  className="px-4 py-3 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white transition-all duration-300 focus:outline-none focus:border-orange-400 focus:bg-white/10 group-hover:border-white/30 min-w-32"
                  value={form.type} 
                  onChange={e=>setForm(f=>({...f, type:e.target.value}))}
                >
                  <option value="EXPENSE" className="bg-gray-800 text-white">Dépense</option>
                  <option value="INCOME" className="bg-gray-800 text-white">Revenu</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10 blur-sm"></div>
              </div>
              
              <button className="px-6 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-add-glow hover:scale-105 active:scale-95 border border-white/20">
                Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* Liste des catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(c=>(
            <div key={c.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative p-5 rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl flex items-center justify-between hover:bg-gray-800/70 hover:border-white/20 transition-all duration-300 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${c.type === 'INCOME' ? 'bg-emerald-400' : 'bg-red-400'} shadow-lg`}></div>
                  <div>
                    <div className="font-semibold text-white text-lg">{c.name}</div>
                    <div className={`text-xs font-medium ${c.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c.type === 'INCOME' ? 'Revenu' : 'Dépense'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={()=>del(c.id)} 
                  className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-red-500/30"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message si aucune catégorie */}
        {list.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-gray-500 rounded-full"></div>
            </div>
            <p className="text-gray-400 text-lg">Aucune catégorie pour le moment</p>
            <p className="text-gray-500 text-sm mt-2">Ajoutez votre première catégorie ci-dessus</p>
          </div>
        )}
      </div>
      
      {/* Particules flottantes */}
      <div className="fixed top-16 left-16 w-1 h-1 bg-amber-400 rounded-full opacity-60 animate-ping"></div>
      <div className="fixed top-32 right-24 w-2 h-2 bg-orange-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-24 left-32 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50 animate-ping" style={{animationDelay: '2s'}}></div>
      <div className="fixed bottom-16 right-16 w-1 h-1 bg-amber-300 rounded-full opacity-30 animate-ping" style={{animationDelay: '0.7s'}}></div>
      
      <style jsx>{`
        .focus\\:shadow-amber-glow:focus {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        }
        .hover\\:shadow-add-glow:hover {
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </div>
  );
}