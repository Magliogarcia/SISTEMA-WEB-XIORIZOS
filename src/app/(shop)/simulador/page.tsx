"use client";

import Link from "next/link";
import { RefreshCw, Wand2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/simulator/image-dropzone";
import { DualCanvas } from "@/components/simulator/dual-canvas";
import { ColorPaletteSelector } from "@/components/simulator/color-palette-selector";
import { useSimulatorStore } from "@/store/simulator-store";
import { useAuthStore } from "@/store/auth-store";

export default function SimuladorPage() {
  const { imagenOriginalUrl, tonoSeleccionado, status, setStatus, reset } = useSimulatorStore();
  const { isAuthenticated } = useAuthStore();

  function handleProcesar() {
    if (!imagenOriginalUrl || !tonoSeleccionado) return;
    setStatus("segmentando");
    setTimeout(() => setStatus("listo"), 1500);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-36 pb-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-primary">Inicia sesión en Xiorizos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Para utilizar el simulador de colorimetría interactivo y probar diferentes tonos en tus rizos, necesitas tener una sesión iniciada.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild className="rounded-full bg-primary hover:bg-secondary text-white">
            <Link href="/login?redirect=/simulador">
              <span>Iniciar sesión</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/registro">Crear cuenta nueva</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-heading text-3xl font-bold text-primary">Simulador de color de cabello</h1>
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
              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  onClick={handleProcesar}
                  disabled={!tonoSeleccionado || status === "segmentando"}
                  className="rounded-full bg-primary hover:bg-secondary text-white font-semibold shadow-sm"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {status === "segmentando" ? "Procesando con IA..." : "Aplicar color"}
                </Button>
                <Button variant="outline" onClick={reset} className="rounded-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cambiar foto
                </Button>
              </div>
            </>
          )}
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-primary">Paleta de tonos</h2>
          <ColorPaletteSelector />
        </aside>
      </div>
    </div>
  );
}
