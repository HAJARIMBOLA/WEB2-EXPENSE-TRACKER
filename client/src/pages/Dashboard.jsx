import { useEffect, useState } from "react";
import { api } from "../lib/apiClient.js";
import StatsCard from "../components/StatsCard.jsx";
import LineMini from "../components/LineMini.jsx";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(()=>{
    api.get("/api/summary").then(({data})=>setSummary(data));
  },[]);

  const series = Array.from({length: 14}, ()=>({value: Math.round(150+Math.random()*150)}));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 relative overflow-hidden">
      {/* Effets d'arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grille de points subtile */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-500">
              <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-0 h-full border border-white/10">
                <StatsCard title="This month income" value={summary?.month?.income} trend={2.3} chart={<LineMini data={series}/>}/>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 hover:from-red-500/30 hover:to-orange-500/30 transition-all duration-500">
              <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-0 h-full border border-white/10">
                <StatsCard title="This month expense" value={summary?.month?.expense} trend={-1.1} chart={<LineMini data={series}/>}/>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 hover:from-violet-500/30 hover:to-purple-500/30 transition-all duration-500">
              <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-0 h-full border border-white/10">
                <StatsCard title="This month balance" value={summary?.month?.balance} trend={1.0} chart={<LineMini data={series}/>}/>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-teal-500/15 hover:from-teal-500/25 hover:to-cyan-500/25 transition-all duration-500">
              <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-0 h-full border border-white/5">
                <StatsCard title="Today income" value={summary?.today?.income} trend={0.0} chart={<LineMini data={series}/>}/>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-rose-500/15 hover:from-rose-500/25 hover:to-pink-500/25 transition-all duration-500">
              <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-0 h-full border border-white/5">
                <StatsCard title="Today expense" value={summary?.today?.expense} trend={0.0} chart={<LineMini data={series}/>}/>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-blue-500/15 to-indigo-500/15 hover:from-indigo-500/25 hover:to-blue-500/25 transition-all duration-500">
              <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-0 h-full border border-white/5">
                <StatsCard title="Today balance" value={summary?.today?.balance} trend={0.0} chart={<LineMini data={series}/>}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Effets de lumière flottants */}
      <div className="fixed top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-ping"></div>
      <div className="fixed top-20 right-20 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-20 left-20 w-3 h-3 bg-violet-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '2s'}}></div>
      <div className="fixed bottom-10 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-ping" style={{animationDelay: '0.5s'}}></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .group:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}