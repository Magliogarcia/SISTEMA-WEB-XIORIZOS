"use client";

import { RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/simulator/image-dropzone";
import { DualCanvas } from "@/components/simulator/dual-canvas";
import { ColorPaletteSelector } from "@/components/simulator/color-palette-selector";
import { useSimulatorStore } from "@/store/simulator-store";

export default function SimuladorPage() {
  const { imagenOriginalUrl, tonoSeleccionado, status, setStatus, reset } = useSimulatorStore();

  function handleProcesar() {
    if (!imagenOriginalUrl || !tonoSeleccionado) return;
    setStatus("segmentando");
    setTimeout(() => setStatus("listo"), 1500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-heading text-3xl font-bold">Simulador de color de cabello</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Sube tu foto, elige un tono y previsualiza el resultado antes de tu cita.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {!imagenOriginalUrl ? (
            <ImageDropzone />
          ) : (
            <>
              <DualCanvas />
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleProcesar} disabled={!tonoSeleccionado || status === "segmentando"}>
                  <Wand2 className="h-4 w-4" />
                  {status === "segmentando" ? "Procesando..." : "Aplicar color"}
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RefreshCw className="h-4 w-4" />
                  Cambiar foto
                </Button>
              </div>
            </>
          )}
        </div>

        <aside className="rounded-xl border border-border p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Paleta de tonos</h2>
          <ColorPaletteSelector />
        </aside>
      </div>
    </div>
  );
}
