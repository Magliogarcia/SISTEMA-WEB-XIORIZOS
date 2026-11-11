"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockHairTones } from "@/lib/mock-data";
import { useSimulatorStore } from "@/store/simulator-store";

export function ColorPaletteSelector() {
  const { tonoSeleccionado, setTono } = useSimulatorStore();

  return (
    <div className="space-y-4">
      <div>
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
