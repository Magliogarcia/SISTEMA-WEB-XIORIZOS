export interface HairColorTone {
  id: string;
  nombre: string;
  hex: string;
  familia: "rubios" | "castaños" | "rojos" | "fantasia" | "negros";
}

export type EstiloAplicacion = "completo" | "mechas";

export type SimulatorStatus = "idle" | "imagen_cargada" | "segmentando" | "listo" | "error";

export interface SimulatorState {
  imagenOriginalUrl: string | null;
  imagenSegmentadaUrl: string | null;
  tonoSeleccionado: HairColorTone | null;
  estiloAplicacion: EstiloAplicacion;
  intensidad: number;
  status: SimulatorStatus;
}
