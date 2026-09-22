"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mockProfessionals } from "@/lib/mock-data";
import { useBookingStore } from "@/store/booking-store";

export function ProfessionalSelector() {
  const { servicio, profesional, setProfesional } = useBookingStore();

  const disponibles = servicio
    ? mockProfessionals.filter((p) => p.serviciosIds.includes(servicio.id))
    : mockProfessionals;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {disponibles.map((p) => {
        const iniciales = p.nombre.split(" ").map((n) => n[0]).join("");
        return (
          <Card
            key={p.id}
            onClick={() => setProfesional(p)}
            className={cn(
              "cursor-pointer text-center transition-all hover:shadow-md",
              profesional?.id === p.id && "border-primary ring-1 ring-primary"
            )}
          >
            <CardContent className="flex flex-col items-center gap-2 p-5">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {iniciales}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-heading font-semibold">{p.nombre}</h3>
              <p className="text-xs text-muted-foreground">{p.especialidad}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
