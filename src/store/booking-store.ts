import { create } from "zustand";
import type { Service, Professional } from "@/types/appointment";

interface BookingState {
  step: number;
  servicio: Service | null;
  profesional: Professional | null;
  fecha: string | null;
  hora: string | null;
  setServicio: (servicio: Service) => void;
  setProfesional: (profesional: Professional) => void;
  setFechaHora: (fecha: string, hora: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  servicio: null,
  profesional: null,
  fecha: null,
  hora: null,
  setServicio: (servicio) => set({ servicio, step: 2 }),
  setProfesional: (profesional) => set({ profesional, step: 3 }),
  setFechaHora: (fecha, hora) => set({ fecha, hora, step: 4 }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  reset: () => set({ step: 1, servicio: null, profesional: null, fecha: null, hora: null }),
}));
