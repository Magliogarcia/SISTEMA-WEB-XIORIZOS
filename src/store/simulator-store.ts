import { create } from "zustand";
import type { HairColorTone, SimulatorStatus } from "@/types/simulator";

interface SimulatorState {
  imagenOriginalUrl: string | null;
  imagenSegmentadaUrl: string | null;
  tonoSeleccionado: HairColorTone | null;
  intensidad: number;
  status: SimulatorStatus;
  setImagenOriginal: (url: string) => void;
  setTono: (tono: HairColorTone) => void;
  setIntensidad: (valor: number) => void;
  setStatus: (status: SimulatorStatus) => void;
  reset: () => void;
}

// NOTA: imagenSegmentadaUrl y status="segmentando"/"listo" quedan listos
// para conectarse con la API de Hugging Face (segmentación) + OpenCV (recoloreo) en el backend.
export const useSimulatorStore = create<SimulatorState>((set) => ({
  imagenOriginalUrl: null,
  imagenSegmentadaUrl: null,
  tonoSeleccionado: null,
  intensidad: 70,
  status: "idle",
  setImagenOriginal: (url) => set({ imagenOriginalUrl: url, status: "imagen_cargada" }),
  setTono: (tono) => set({ tonoSeleccionado: tono }),
  setIntensidad: (valor) => set({ intensidad: valor }),
  setStatus: (status) => set({ status }),
  reset: () =>
    set({
      imagenOriginalUrl: null,
      imagenSegmentadaUrl: null,
      tonoSeleccionado: null,
      intensidad: 70,
      status: "idle",
    }),
}));
