"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { mockServices } from "@/lib/mock-data";
import { useBookingStore } from "@/store/booking-store";

export function ServiceSelector() {
  const { servicio, setServicio } = useBookingStore();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {mockServices.map((s) => (
        <Card
          key={s.id}
          onClick={() => setServicio(s)}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            servicio?.id === s.id && "border-primary ring-1 ring-primary"
          )}
        >
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold">{s.nombre}</h3>
              <span className="font-heading font-bold text-primary">{formatCurrency(s.precio)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{s.descripcion}</p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {s.duracionMin} min
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
