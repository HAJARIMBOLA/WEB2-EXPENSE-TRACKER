import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="font-semibold text-xl text-transparent bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text">
        Expense Tracker
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-gray-300 text-sm">
              Welcome, <span className="text-white font-medium">{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}