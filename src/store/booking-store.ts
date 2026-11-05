import { create } from "zustand";
import type { Service, Professional } from "@/types/appointment";

interface BookingState {
  step: number;
  servicio: Service | null;
  profesional: Professional | null;
  fecha: string | null;
  hora: string | null;
  setStep: (step: number) => void;
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
  setStep: (step) => set({ step: Math.max(1, Math.min(4, step)) }),
  setServicio: (servicio) =>
    set((state) => ({
      servicio,
      // Avanzar al paso 2 solo si estamos en el paso 1
      step: state.step === 1 ? 2 : state.step,
    })),
  setProfesional: (profesional) =>
    set((state) => ({
      profesional,
      // Avanzar al paso 3 solo si estamos en el paso 2
      step: state.step === 2 ? 3 : state.step,
    })),
  setFechaHora: (fecha, hora) =>
    set((state) => ({
      fecha,
      hora,
      // Avanzar al paso 4 solo si estamos en el paso 3
      step: state.step === 3 ? 4 : state.step,
    })),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  reset: () =>
    set({
      step: 1,
      servicio: null,
      profesional: null,
      fecha: null,
      hora: null,
    }),
}));
