import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add("dark"); localStorage.setItem("theme","dark"); }
    else      { root.classList.remove("dark"); localStorage.setItem("theme","light"); }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="rounded-[1rem] px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 shadow-sm"
      title="Toggle theme"
    >
      {dark ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
}
