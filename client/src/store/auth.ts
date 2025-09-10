import { create } from "zustand";

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  isAuthed: () => boolean;
};

export const useAuth = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  setToken: (t) => {
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    set({ token: t });
  },
  isAuthed: () => !!get().token,
}));
