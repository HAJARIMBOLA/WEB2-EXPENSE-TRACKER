import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useAuth((s) => s.isAuthed());
  return isAuthed ? children : <Navigate to="/login" replace />;
}
