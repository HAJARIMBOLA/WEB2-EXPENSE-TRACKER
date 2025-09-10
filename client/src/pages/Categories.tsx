import { useEffect, useState } from "react";
import axios from "axios";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (err) {
        setError("Impossible de charger les catégories");
      }
    };
    fetchCategories();
  }, []);

  // Ajouter une catégorie
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        { name },
        { withCredentials: true }
      );
      setCategories([...categories, res.data]);
      setName("");
    } catch (err) {
      setError("Erreur lors de l'ajout de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catégories</h1>

      {/* Formulaire ajout */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {/* Liste */}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="border rounded px-3 py-2 flex justify-between items-center"
          >
            <span>{cat.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(cat.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
