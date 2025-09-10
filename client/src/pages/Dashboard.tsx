import { useEffect, useState } from "react";
import api from "../service/api";

type Summary = {
  monthStart: string;
  monthEnd: string;
  totalIncome: number;
  totalExpenses: number;
  remaining: number;
  alert: boolean;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchSummary = async () => {
    try {
      const res = await api.get("/summary/monthly");
      setSummary(res.data);
    } catch (err) {
      setError("Impossible de charger le résumé.");
    }
  };
  fetchSummary();
}, []);

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  if (!summary) {
    return <p className="p-4">Chargement...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-100 border border-green-400 rounded p-4 text-center">
          <h2 className="font-semibold">Revenus</h2>
          <p className="text-xl font-bold text-green-700">
            {summary.totalIncome.toFixed(2)} €
          </p>
        </div>

        <div className="bg-red-100 border border-red-400 rounded p-4 text-center">
          <h2 className="font-semibold">Dépenses</h2>
          <p className="text-xl font-bold text-red-700">
            {summary.totalExpenses.toFixed(2)} €
          </p>
        </div>

        <div
          className={`rounded p-4 text-center ${
            summary.remaining < 0
              ? "bg-red-200 border border-red-500"
              : "bg-blue-100 border border-blue-400"
          }`}
        >
          <h2 className="font-semibold">Reste</h2>
          <p
            className={`text-xl font-bold ${
              summary.remaining < 0 ? "text-red-700" : "text-blue-700"
            }`}
          >
            {summary.remaining.toFixed(2)} €
          </p>
        </div>
      </div>

      {summary.alert && (
        <p className="mt-6 text-red-600 font-semibold text-center">
          ⚠️ Vous avez dépassé votre budget ce mois-ci !
        </p>
      )}
    </div>
  );
}
