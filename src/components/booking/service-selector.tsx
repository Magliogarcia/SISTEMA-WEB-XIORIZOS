"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockServices } from "@/lib/mock-data";
import { useBookingStore } from "@/store/booking-store";

export function ServiceSelector() {
  const { servicio, setServicio } = useBookingStore();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("servicio");

  useEffect(() => {
    if (serviceParam && !servicio) {
      const match = mockServices.find((s) => s.id === serviceParam);
      if (match) {
        setServicio(match);
      }
    }
  }, [serviceParam, servicio, setServicio]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary font-headline-sm">
            Selecciona tu Servicio Especializado
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Elige el protocolo ideal para tu patrón de curvatura o servicio de uñas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockServices.map((s) => {
          const isSelected = servicio?.id === s.id;
          return (
            <Card
              key={s.id}
              onClick={() => setServicio(s)}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md border rounded-3xl overflow-hidden",
                isSelected
                  ? "border-primary ring-2 ring-primary bg-primary/5 shadow-md"
                  : "border-surface-container bg-surface-container-lowest hover:border-primary/30"
              )}
            >
              <CardContent className="p-4 flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 bg-surface-container-low">
                  <Image
                    src={s.imagenUrl || "/images/Full_curl.webp"}
                    alt={s.nombre}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">
                        {s.categoria}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-primary fill-primary text-white" />
                      )}
                    </div>
                    <h3 className="font-headline-sm text-sm font-bold text-primary mt-1 leading-snug">
                      {s.nombre}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                      {s.descripcion}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-1 border-t border-surface-container">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3 text-secondary" /> {s.duracionMin} min
                    </span>
                    <span className="text-primary font-bold text-xs">
                      {isSelected ? "Seleccionado" : "Elegir"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
