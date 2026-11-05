"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

  const disponibles = servicio
    ? profesionales.filter((p) => p.serviciosIds.includes(servicio.id))
    : profesionales;

  return (
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
              <Avatar className="h-20 w-20 shadow-sm border border-surface-container">
                <AvatarImage src={p.avatarUrl} alt={p.nombre} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {iniciales}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-heading font-semibold text-sm text-primary">{p.nombre}</h3>
              <p className="text-xs text-on-surface-variant">{p.especialidad}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
