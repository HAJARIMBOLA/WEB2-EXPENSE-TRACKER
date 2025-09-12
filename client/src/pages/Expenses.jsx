import { useEffect, useState } from "react";
import { api } from "../lib/apiClient.js";
import { toInputDate } from "../utils/date.js";

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ categoryId: "", amount: "", date: toInputDate(new Date()), note: "" });

  const load = async ()=>{
    const [{ data: c }, { data: e }] = await Promise.all([
      api.get("/api/categories"),
      api.get("/api/expenses")
    ]);
    setCats(c.filter(x=>x.type==="EXPENSE"));
    setItems(e.items);
    if (!form.categoryId && c.length) setForm(f=>({...f, categoryId: c.find(x=>x.type==="EXPENSE")?.id || ""}));
  };
  useEffect(()=>{ load(); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    await api.post("/api/expenses", { ...form, amount: Number(form.amount), date: new Date(form.date) });
    setForm(f=>({ ...f, amount:"", note:"" }));
    load();
  };
  const del = async (id)=>{ await api.delete(`/api/expenses/${id}`); load(); };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-2xl font-semibold text-white">Expenses</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white col-span-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={form.categoryId} onChange={e=>setForm(f=>({...f, categoryId:e.target.value}))}>
            {cats.map(c=> <option key={c.id} value={c.id} className="bg-gray-700">{c.name}</option>)}
          </select>
          <input className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                 placeholder="Amount" type="number" step="0.01"
                 value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))}/>
          <input className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                 type="date"
                 value={form.date} onChange={e=>setForm(f=>({...f, date:e.target.value}))}/>
          <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg">
            Add
          </button>
          <input className="md:col-span-5 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                 placeholder="Note"
                 value={form.note} onChange={e=>setForm(f=>({...f, note:e.target.value}))}/>
        </form>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 bg-gray-750 border-b border-gray-600">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Note</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.map(x=>(
                <tr key={x.id} className="hover:bg-gray-750 transition-colors duration-150">
                  <td className="p-4 text-gray-300">{new Date(x.date).toLocaleDateString()}</td>
                  <td className="p-4 text-white">{x.category?.name}</td>
                  <td className="p-4 text-teal-400 font-medium">{Number(x.amount).toLocaleString()}</td>
                  <td className="p-4 text-gray-300">{x.note}</td>
                  <td className="p-4">
                    <button onClick={()=>del(x.id)} 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded transition-all duration-150">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}