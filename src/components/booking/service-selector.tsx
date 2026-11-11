"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Clock, CheckCircle, AlertTriangle, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockServices } from "@/lib/mock-data";
import { useBookingStore } from "@/store/booking-store";

export function ServiceSelector() {
  const { servicio, setServicio } = useBookingStore();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("servicio");
  const [empleados, setEmpleados] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/empleados")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.employees)) {
          setEmpleados(d.employees);
        }
      })
      .catch(() => {});
  }, []);

  const checkDisponibilidad = useCallback(
    (servId: string): { disponible: boolean; motivo?: string } => {
      if (empleados.length === 0) return { disponible: true };

      const asignados = empleados.filter(
        (e) => Array.isArray(e.serviciosIds) && e.serviciosIds.includes(servId)
      );

      if (asignados.length === 0) return { disponible: true };

      const hoy = new Date().toISOString().split("T")[0];
      const operativos = asignados.filter((e) => {
        if (e.activo === false) return false;
        if (e.tipoInoperatividad === "reposo" || e.tipoInoperatividad === "vacaciones") {
          if (e.fechaInicioInoperatividad && e.fechaFinInoperatividad) {
            if (hoy >= e.fechaInicioInoperatividad && hoy <= e.fechaFinInoperatividad) {
              return false;
            }
          } else {
            return false;
          }
        }
        return true;
      });

      if (operativos.length === 0) {
        const nombres = asignados.map((e) => e.nombre).join(", ");
        return {
          disponible: false,
          motivo: `Especialista (${nombres}) en reposo médico / permiso`,
        };
      }

      return { disponible: true };
    },
    [empleados]
  );

  useEffect(() => {
    if (serviceParam && !servicio && empleados.length > 0) {
      const match = mockServices.find((s) => s.id === serviceParam);
      if (match) {
        const { disponible } = checkDisponibilidad(match.id);
        if (disponible) {
          setServicio(match);
        }
      }
    }
  }, [serviceParam, servicio, setServicio, empleados, checkDisponibilidad]);

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
          const { disponible, motivo } = checkDisponibilidad(s.id);

          return (
            <Card
              key={s.id}
              onClick={() => {
                if (disponible) {
                  setServicio(s);
                }
              }}
              className={cn(
                "transition-all duration-200 border rounded-3xl overflow-hidden relative",
                !disponible
                  ? "opacity-60 bg-surface-container-low border-rose-200 cursor-not-allowed select-none"
                  : isSelected
                  ? "cursor-pointer border-primary ring-2 ring-primary bg-primary/5 shadow-md"
                  : "cursor-pointer border-surface-container bg-surface-container-lowest hover:border-primary/30 hover:shadow-md"
              )}
            >
              <CardContent className="p-4 flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 bg-surface-container-low">
                  <Image
                    src={s.imagenUrl || "/images/Full_curl.webp"}
                    alt={s.nombre}
                    fill
                    sizes="80px"
                    className={`object-cover ${!disponible ? "grayscale" : ""}`}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">
                        {s.categoria}
                      </span>
                      {isSelected && disponible && (
                        <CheckCircle className="w-4 h-4 text-primary fill-primary text-white" />
                      )}
                      {!disponible && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 uppercase">
                          <Ban className="h-3 w-3" />
                          <span>No disponible</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-sm text-sm font-bold text-primary mt-1 leading-snug">
                      {s.nombre}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                      {s.descripcion}
                    </p>

                    {!disponible && (
                      <p className="text-[11px] font-medium text-rose-700 mt-1.5 flex items-center gap-1 bg-rose-50/80 p-1 rounded">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span>{motivo || "Sin especialista operativo disponible"}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-1 border-t border-surface-container">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3 text-secondary" /> {s.duracionMin} min
                    </span>
                    <span className={cn("font-bold text-xs", !disponible ? "text-rose-600" : "text-primary")}>
                      {!disponible ? "Deshabilitado" : isSelected ? "Seleccionado" : "Elegir"}
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
