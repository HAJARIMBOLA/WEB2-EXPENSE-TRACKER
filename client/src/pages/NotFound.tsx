import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-gray-900">404</h1>
        <p className="mt-3 text-xl text-gray-700">Page introuvable</p>
        <p className="mt-1 text-gray-500">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Aller au Dashboard
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
