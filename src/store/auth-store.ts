import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { useBookingStore } from "./booking-store";
import { useCartStore } from "./cart-store";

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
        // Limpiar cualquier borrador de reserva previo al iniciar sesión
        try {
          useBookingStore.getState().reset();
        } catch {}
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "xiorizos_role=; path=/; max-age=0; SameSite=Lax";
          fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        }
        // Limpiar borrador de cita y carrito para no transferirlos a otra cuenta
        try {
          useBookingStore.getState().reset();
          useCartStore.getState().clearCart();
        } catch {}
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
