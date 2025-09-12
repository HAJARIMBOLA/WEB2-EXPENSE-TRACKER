import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 ${
        isActive ? "bg-blue-100 dark:bg-slate-800 font-medium" : ""
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-56 p-3 space-y-1">
      <Item to="/dashboard">Dashboard</Item>
      <Item to="/expenses">Expenses</Item>
      <Item to="/incomes">Incomes</Item>
      <Item to="/categories">Categories</Item>
      <Item to="/profile">Profile</Item>
    </aside>
  );
}
