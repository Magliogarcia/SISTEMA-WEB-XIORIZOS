"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useSimulatorStore } from "@/store/simulator-store";

/**
 * Componente de lienzo dual. Dibuja la imagen original en el primer canvas.
 * El segundo canvas está preparado para recibir la imagen ya segmentada/recoloreada
 * que devolverá el backend (Hugging Face para segmentación + OpenCV para el recoloreo).
 * Mientras tanto, se aplica una superposición de color semitransparente sobre la zona
 * central como previsualización aproximada en el frontend.
 */
export function DualCanvas() {
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { imagenOriginalUrl, tonoSeleccionado, intensidad, status } = useSimulatorStore();

  useEffect(() => {
    if (!imagenOriginalUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagenOriginalUrl;
    img.onload = () => {
      [originalCanvasRef.current, previewCanvasRef.current].forEach((canvas) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const maxWidth = canvas.parentElement?.clientWidth ?? 400;
        const scale = maxWidth / img.width;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      });
    };
  }, [imagenOriginalUrl]);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !tonoSeleccionado || !imagenOriginalUrl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagenOriginalUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = intensidad / 100;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = tonoSeleccionado.hex;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.45);
      ctx.restore();
    };
  }, [tonoSeleccionado, intensidad, imagenOriginalUrl]);

  if (!imagenOriginalUrl) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        Carga una foto para ver la previsualización
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-center text-sm font-medium text-muted-foreground">Original</p>
        <canvas ref={originalCanvasRef} className="w-full rounded-xl border border-border" />
      </div>
      <div className="relative">
        <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
          Previsualización {tonoSeleccionado ? `— ${tonoSeleccionado.nombre}` : ""}
        </p>
        <canvas ref={previewCanvasRef} className="w-full rounded-xl border border-border" />
        {status === "segmentando" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
