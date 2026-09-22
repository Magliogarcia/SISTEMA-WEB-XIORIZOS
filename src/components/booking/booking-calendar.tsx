"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatDate } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";

const horasDisponibles = [
  "09:00", "09:30", "10:00", "10:30", "11:00",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export function BookingCalendar() {
  const { setFechaHora } = useBookingStore();
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState<string | null>(null);

  function confirmarHora(h: string) {
    if (!fecha) return;
    setHora(h);
    setFechaHora(fecha.toISOString(), h);
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="rounded-xl border border-border p-2">
        <Calendar
          mode="single"
          selected={fecha}
          onSelect={(d) => {
            setFecha(d);
            setHora(null);
          }}
          disabled={{ before: new Date() }}
          className="mx-auto"
        />
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">
          {fecha ? `Horas disponibles para ${formatDate(fecha)}` : "Selecciona una fecha primero"}
        </h3>
        {fecha && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {horasDisponibles.map((h) => (
              <button
                key={h}
                onClick={() => confirmarHora(h)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  hora === h
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-secondary"
                )}
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
