"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockHairTones } from "@/lib/mock-data";
import { useSimulatorStore } from "@/store/simulator-store";

export function ColorPaletteSelector() {
  const { tonoSeleccionado, setTono, intensidad, setIntensidad } = useSimulatorStore();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-3">
          Tonos disponibles formulados para rizos:
        </p>
        <div className="flex flex-col gap-2.5">
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
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:bg-secondary/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full border border-black/15 shadow-inner shrink-0"
                    style={{ backgroundColor: tono.hex }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">{tono.nombre}</p>
                    <p className="text-[11px] text-muted-foreground capitalize">{tono.familia}</p>
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

      <div className="pt-2 border-t border-border">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Intensidad del matiz</h3>
          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            {intensidad}%
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={intensidad}
          onChange={(e) => setIntensidad(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Sutil (10%)</span>
          <span>Medio (50%)</span>
          <span>Intenso (100%)</span>
        </div>
      </div>
    </div>
  );
}
