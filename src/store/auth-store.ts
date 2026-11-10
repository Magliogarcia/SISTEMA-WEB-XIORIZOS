import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        if (typeof document !== "undefined") {
          document.cookie = `xiorizos_role=${user.rol}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "xiorizos_role=; path=/; max-age=0; SameSite=Lax";
          fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "xiorizos-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.user?.rol && typeof document !== "undefined") {
          document.cookie = `xiorizos_role=${state.user.rol}; path=/; max-age=604800; SameSite=Lax`;
        }
      },
    }
  )
);
