/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useSimulatorStore } from "@/store/simulator-store";

export function DualCanvas() {
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const { imagenOriginalUrl, imagenSegmentadaUrl, tonoSeleccionado, intensidad, status } =
    useSimulatorStore();

  useEffect(() => {
    // Solo procesar/dibujar el resultado cuando el usuario haya pulsado "Aplicar color" y esté "listo"
    if (status !== "listo" || !imagenOriginalUrl || !tonoSeleccionado) return;

    // Si ya existe una imagen directa generada por la API de IA
    if (imagenSegmentadaUrl) return;

    const canvas = resultCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagenOriginalUrl;
    img.onload = () => {
      const maxWidth = canvas.parentElement?.clientWidth ?? 450;
      const scale = maxWidth / img.width;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Tinte suave armónico en modo color, sin recuadros cortados ni franjas oscuras
      ctx.save();
      ctx.globalAlpha = Math.min(0.5, (intensidad / 100) * 0.45);
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = tonoSeleccionado.hex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
  }, [status, imagenOriginalUrl, imagenSegmentadaUrl, tonoSeleccionado, intensidad]);

  if (!imagenOriginalUrl) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground bg-surface-container-lowest">
        Carga una foto para comenzar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-start">
      {/* Columna Izquierda: Imagen Original Subida */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-primary">Foto Original</p>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Subida
          </span>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-50 shadow-sm flex items-center justify-center">
          <img
            src={imagenOriginalUrl}
            alt="Foto original subida"
            className="w-full h-auto max-h-[500px] object-contain block select-none"
          />
        </div>
      </div>

      {/* Columna Derecha: Resultado con IA */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-primary">Resultado con IA</p>
          {status === "listo" && tonoSeleccionado && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tonoSeleccionado.nombre}
            </span>
          )}
        </div>

        {/* Estado 1: Recién subida la imagen -> NO mostrar previsualización previa ni recuadros negros */}
        {status !== "segmentando" && status !== "listo" && (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border bg-card text-center min-h-[380px] h-full shadow-xs">
            <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <p className="font-semibold text-primary text-base">
              Esperando procesamiento
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
              {tonoSeleccionado
                ? `Tono "${tonoSeleccionado.nombre}" seleccionado. Haz clic en "Aplicar color" para que la IA procese la imagen.`
                : "Elige uno de los 3 tonos en el panel derecho y haz clic en 'Aplicar color' para procesar tu cabello con IA."}
            </p>
          </div>
        )}

        {/* Estado 2: Procesando con IA */}
        {status === "segmentando" && (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card text-center min-h-[380px] h-full shadow-xs animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
            <p className="font-semibold text-primary text-base">
              La IA está procesando tu imagen...
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
              Analizando las hebras capilares y aplicando el tono <strong>{tonoSeleccionado?.nombre}</strong> al {intensidad}%.
            </p>
          </div>
        )}

        {/* Estado 3: Imagen procesada por la IA */}
        {status === "listo" && (
          <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-50 shadow-sm animate-in fade-in duration-300">
            {imagenSegmentadaUrl ? (
              <img
                src={imagenSegmentadaUrl}
                alt={`Resultado con IA ${tonoSeleccionado?.nombre || ""}`}
                className="w-full h-auto max-h-[500px] object-contain block select-none"
              />
            ) : (
              <canvas
                ref={resultCanvasRef}
                className="w-full h-auto max-h-[500px] object-contain block select-none"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
