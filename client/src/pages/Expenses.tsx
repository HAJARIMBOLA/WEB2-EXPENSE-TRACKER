import { useEffect, useState } from "react";
import axios from "axios";

type Expense = {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: "ONE_TIME" | "RECURRING";
  category: { name: string };
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Charger les dépenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        withCredentials: true,
      });
      setExpenses(res.data);
    } catch (err) {
      setError("Impossible de charger les dépenses.");
    }
  };

  // Ajouter une dépense
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/expenses`,
        { amount: Number(amount), description, categoryId: "default" }, // ⚠️ adapte `categoryId`
        { withCredentials: true }
      );
      setAmount("");
      setDescription("");
      fetchExpenses();
    } catch {
      setError("Erreur lors de l’ajout de la dépense.");
    }
  };

  // Supprimer une dépense
  const deleteExpense = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, {
        withCredentials: true,
      });
      fetchExpenses();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes Dépenses</h1>

      {/* Formulaire d’ajout */}
      <form onSubmit={addExpense} className="mb-6 flex gap-2">
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
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Liste des dépenses */}
      <ul className="space-y-2">
        {expenses.map((exp) => (
          <li
            key={exp.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <div>
              <p className="font-medium">{exp.description || "Sans description"}</p>
              <p className="text-sm text-gray-600">
                {exp.amount} € – {exp.category?.name} ({exp.type})
              </p>
            </div>
            <button
              onClick={() => deleteExpense(exp.id)}
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
