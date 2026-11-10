"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockProfessionals } from "@/lib/mock-data";
import { useBookingStore } from "@/store/booking-store";
import type { Professional } from "@/types/appointment";

export function ProfessionalSelector() {
  const { servicio, profesional, setProfesional } = useBookingStore();
  const [profesionales, setProfesionales] = useState<Professional[]>(mockProfessionals);

  useEffect(() => {
    fetch("/api/empleados")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.employees)) {
          // Filtrar ESTRICTAMENTE los estilistas activos y con servicios asignados
          // (Excluye personal gerencial/administrativo como Germán Jácome)
          const activos = data.employees
            .filter((e: any) => {
              if (e.activo === false) return false;
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
            }));
          if (activos.length > 0) {
            setProfesionales(activos);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 1. Filtrar especialistas asignados al servicio
  let disponibles = servicio
    ? profesionales.filter((p) => Array.isArray(p.serviciosIds) && p.serviciosIds.includes(servicio.id))
    : profesionales;

  // 2. Red de seguridad: si un servicio no tiene especialista asignado o la asignada está temporalmente inactiva,
  // mostrar las especialistas activas del área correspondiente para que el usuario NUNCA se quede con la lista vacía
  if (disponibles.length === 0 && profesionales.length > 0) {
    if (servicio?.categoria === "Uñas" || servicio?.id === "s12") {
      const manicuristas = profesionales.filter((p) => p.serviciosIds?.includes("s12"));
      disponibles = manicuristas.length > 0 ? manicuristas : profesionales;
    } else {
      // Para servicios capilares, mostrar las especialistas en rizos y color
      const estilistasCapilares = profesionales.filter((p) => !p.serviciosIds?.includes("s12"));
      disponibles = estilistasCapilares.length > 0 ? estilistasCapilares : profesionales;
    }
  }

  if (disponibles.length === 0) {
    return (
      <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-8 text-center space-y-3">
        <p className="text-base font-semibold text-primary">
          Coordinación de Especialistas
        </p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          En este momento nuestro equipo está ajustando la agenda para este servicio. Puedes contactarnos directamente por WhatsApp al{" "}
          <a
            href="https://wa.me/584127434761"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline"
          >
            +58 412 7434761
          </a>{" "}
          o regresar al paso anterior para escoger otro servicio.
        </p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {disponibles.map((p) => {
          const iniciales = p.nombre
            .split(" ")
            .map((n) => n[0])
            .join("");
          return (
            <Card
              key={p.id}
              onClick={() => setProfesional(p)}
              className={cn(
                "cursor-pointer text-center transition-all hover:shadow-md rounded-xl border",
                profesional?.id === p.id
                  ? "border-primary ring-2 ring-primary bg-primary/5"
                  : "border-surface-container bg-surface-container-lowest hover:border-primary/30"
              )}
            >
              <CardContent className="flex flex-col items-center gap-2 p-5">
                <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-sm border border-surface-container bg-surface-container-low shrink-0">
                  <Image
                    src={p.avatarUrl || "/images/fundadora_xioilin_guzman.webp"}
                    alt={p.nombre}
                    fill
                    sizes="80px"
                    priority
                    loading="eager"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-heading font-semibold text-sm text-primary">{p.nombre}</h3>
                <p className="text-xs text-on-surface-variant">{p.especialidad}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
