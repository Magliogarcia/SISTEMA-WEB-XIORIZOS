"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockHairTones } from "@/lib/mock-data";
import { useSimulatorStore } from "@/store/simulator-store";
import type { HairColorTone } from "@/types/simulator";

const familias: { key: HairColorTone["familia"]; label: string }[] = [
  { key: "rubios", label: "Rubios" },
  { key: "castaños", label: "Castaños" },
  { key: "rojos", label: "Rojos" },
  { key: "negros", label: "Negros" },
  { key: "fantasia", label: "Fantasía" },
];

export function ColorPaletteSelector() {
  const { tonoSeleccionado, setTono, intensidad, setIntensidad } = useSimulatorStore();

  return (
    <div className="space-y-6">
      {familias.map((familia) => {
        const tonos = mockHairTones.filter((t) => t.familia === familia.key);
        if (tonos.length === 0) return null;

        return (
          <div key={familia.key}>
            <h3 className="mb-2 text-sm font-semibold">{familia.label}</h3>
            <div className="flex flex-wrap gap-3">
              {tonos.map((tono) => (
                <button
                  key={tono.id}
                  onClick={() => setTono(tono)}
                  title={tono.nombre}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-transform hover:scale-110",
                    tonoSeleccionado?.id === tono.id ? "border-primary" : "border-white"
                  )}
                  style={{ backgroundColor: tono.hex }}
                >
                  {tonoSeleccionado?.id === tono.id && (
                    <Check
                      className="h-4 w-4"
                      style={{
                        color: parseInt(tono.hex.replace("#", ""), 16) > 0xaaaaaa ? "#111" : "#fff",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Intensidad</h3>
          <span className="text-sm text-muted-foreground">{intensidad}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={intensidad}
          onChange={(e) => setIntensidad(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>
  );
}
