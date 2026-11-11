import { create } from "zustand";
import type { HairColorTone, SimulatorStatus } from "@/types/simulator";

interface SimulatorState {
  imagenOriginalUrl: string | null;
  imagenSegmentadaUrl: string | null;
  tonoSeleccionado: HairColorTone | null;
  intensidad: number;
  status: SimulatorStatus;
  setImagenOriginal: (url: string) => void;
  setImagenSegmentada: (url: string | null) => void;
  setTono: (tono: HairColorTone) => void;
  setIntensidad: (valor: number) => void;
  setStatus: (status: SimulatorStatus) => void;
  reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  imagenOriginalUrl: null,
  imagenSegmentadaUrl: null,
  tonoSeleccionado: null,
  intensidad: 80,
  status: "idle",
  setImagenOriginal: (url) =>
    set({ imagenOriginalUrl: url, imagenSegmentadaUrl: null, status: "imagen_cargada" }),
  setImagenSegmentada: (url) => set({ imagenSegmentadaUrl: url }),
  setTono: (tono) => set({ tonoSeleccionado: tono }),
  setIntensidad: (valor) => set({ intensidad: valor }),
  setStatus: (status) => set({ status }),
  reset: () =>
    set({
      imagenOriginalUrl: null,
      imagenSegmentadaUrl: null,
      tonoSeleccionado: null,
      intensidad: 80,
      status: "idle",
    }),
}));
