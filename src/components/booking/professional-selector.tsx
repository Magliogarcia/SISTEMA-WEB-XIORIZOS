"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockProfessionals } from "@/lib/mock-data";
import { useBookingStore } from "@/store/booking-store";
import type { Professional } from "@/types/appointment";

export function ProfessionalSelector() {
  const { servicio, profesional, setProfesional } = useBookingStore();
  const [profesionales, setProfesionales] = useState<Professional[]>(mockProfessionals);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/empleados")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.employees)) {
          const hoy = new Date().toISOString().split("T")[0];

          // Filtrar ESTRICTAMENTE los estilistas que estén operativos y no en reposo activo
          const operativos = data.employees
            .filter((e: any) => {
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

              const nombreLow = (e.nombre || "").toLowerCase();
              const cargoLow = (e.cargo || "").toLowerCase();
              if (
                nombreLow.includes("germán") ||
                nombreLow.includes("german") ||
                cargoLow.includes("gerente")
              ) {
                return false;
              }
              return Array.isArray(e.serviciosIds) && e.serviciosIds.length > 0;
            })
            .map((e: any) => ({
              id: e.id,
              nombre: e.nombre,
              especialidad: e.cargo || e.especialidad,
              avatarUrl: e.avatarUrl,
              serviciosIds: e.serviciosIds,
              tipoInoperatividad: e.tipoInoperatividad,
              fechaInicioInoperatividad: e.fechaInicioInoperatividad,
              fechaFinInoperatividad: e.fechaFinInoperatividad,
              fechasAusente: e.fechasAusente,
            }));

          setProfesionales(operativos);
        }
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  // Filtrar especialistas capacitados y asignados estrictamente al servicio
  const disponibles = servicio
    ? profesionales.filter((p) => Array.isArray(p.serviciosIds) && p.serviciosIds.includes(servicio.id))
    : profesionales;

  if (disponibles.length === 0 && !cargando) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-base font-bold text-rose-950">
          Servicio Temporalmente No Disponible en Agenda
        </p>
        <p className="text-xs text-rose-800 max-w-md mx-auto leading-relaxed">
          El personal especializado asignado a este servicio se encuentra actualmente en reposo médico o permiso temporal. Para proteger la calidad de tu atención, este servicio no puede agendarse en línea por el momento.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/584127434761"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-white text-xs font-bold hover:scale-105 transition-all shadow-sm"
          >
            Consultar disponibilidad vía WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {servicio && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-muted-foreground pb-1">
          <span>
            Especialistas disponibles para <strong>{servicio.nombre}</strong> ({disponibles.length})
          </span>
          {profesional && (
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
              Seleccionado: {profesional.nombre}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {disponibles.map((p) => {
          const isSelected = profesional?.id === p.id;
          return (
            <Card
              key={p.id}
              onClick={() => setProfesional(p)}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md border rounded-3xl overflow-hidden",
                isSelected
                  ? "border-primary ring-2 ring-primary bg-primary/5 shadow-md"
                  : "border-surface-container bg-surface-container-lowest hover:border-primary/30"
              )}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden relative mb-3 bg-surface-container-low border-2 border-surface-container shadow-xs">
                  <Image
                    src={p.avatarUrl || "/images/fundadora_xioilin_guzman.webp"}
                    alt={p.nombre}
                    fill
                    sizes="96px"
                    unoptimized={true}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-headline-sm text-sm font-bold text-primary">
                  {p.nombre}
                </h3>
                <p className="text-xs text-secondary font-medium mt-0.5">
                  {p.especialidad}
                </p>
                <div className="mt-3 w-full pt-2 border-t border-surface-container flex items-center justify-center">
                  <span
                    className={cn(
                      "text-xs font-bold py-1 px-3 rounded-full",
                      isSelected
                        ? "bg-primary text-on-primary"
                        : "text-primary hover:bg-surface-container"
                    )}
                  >
                    {isSelected ? "Seleccionado" : "Elegir"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
