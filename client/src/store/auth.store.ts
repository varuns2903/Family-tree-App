import { create } from "zustand";
import type { User } from "../types/user.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (user, token) => {
    localStorage.setItem("accessToken", token);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      set({ isAuthenticated: true });
    }

    set({ isHydrated: true });
  },
}));
