"use client";

import { Check, Sparkles, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockHairTones } from "@/lib/mock-data";
import { useSimulatorStore } from "@/store/simulator-store";

export function ColorPaletteSelector() {
  const { tonoSeleccionado, setTono, estiloAplicacion, setEstiloAplicacion } = useSimulatorStore();

  return (
    <div className="space-y-5">
      {/* Selector de Estilo: Tinte Completo vs Mechas */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-primary block">
          Técnica de Aplicación
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setEstiloAplicacion("completo")}
            className={cn(
              "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer",
              estiloAplicacion === "completo"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/20"
                : "border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Paintbrush className="h-4 w-4 mb-1" />
            <span className="text-xs">Tinte Completo</span>
          </button>
          <button
            type="button"
            onClick={() => setEstiloAplicacion("mechas")}
            className={cn(
              "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer",
              estiloAplicacion === "mechas"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/20"
                : "border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Sparkles className="h-4 w-4 mb-1 text-secondary" />
            <span className="text-xs">Con Mechas</span>
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          {estiloAplicacion === "mechas"
            ? "✨ Ilumina mechones y destellos sobre tu base natural."
            : "🎨 Cobertura uniforme en todo el cabello."}
        </p>
      </div>

      <div className="pt-2 border-t border-border">
        <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2.5">
          Tono de Color
        </label>
        <div className="flex flex-col gap-2">
          {mockHairTones.map((tono) => {
            const isSelected = tonoSeleccionado?.id === tono.id;
            return (
              <button
                key={tono.id}
                type="button"
                onClick={() => setTono(tono)}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full border border-black/15 shadow-inner shrink-0"
                    style={{ backgroundColor: tono.hex }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">{tono.nombre}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{tono.familia}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
