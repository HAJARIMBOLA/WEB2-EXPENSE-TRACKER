import { useEffect, useState } from "react";
import axios from "axios";

type Income = {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  source: string;
};

export default function Incomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  // Charger les revenus
  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/incomes`, {
        withCredentials: true,
      });
      setIncomes(res.data);
    } catch (err) {
      setError("Impossible de charger les revenus.");
    }
  };

  // Ajouter un revenu
  const addIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/incomes`,
        { amount: Number(amount), source },
        { withCredentials: true }
      );
      setAmount("");
      setSource("");
      fetchIncomes();
    } catch {
      setError("Erreur lors de l’ajout du revenu.");
    }
  };

  // Supprimer un revenu
  const deleteIncome = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/incomes/${id}`, {
        withCredentials: true,
      });
      fetchIncomes();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes Revenus</h1>

      {/* Formulaire d’ajout */}
      <form onSubmit={addIncome} className="mb-6 flex gap-2">
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-32"
          required
        />
        <input
          type="text"
          placeholder="Source (ex: Salaire, Vente...)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Liste des revenus */}
      <ul className="space-y-2">
        {incomes.map((inc) => (
          <li
            key={inc.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <div>
              <p className="font-medium">{inc.source}</p>
              <p className="text-sm text-gray-600">
                {inc.amount} € – {new Date(inc.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteIncome(inc.id)}
              className="text-red-600 font-semibold"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
