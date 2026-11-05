"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatDate } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import { Clock, Calendar as CalendarIcon, Sun, Sunset, AlertCircle, CheckCircle2 } from "lucide-react";

// Horario oficial del salón Xiorizos:
// Martes a Sábado de 8:30 a.m. a 5:30 p.m.
// Domingos y Lunes cerrado.
const turnosManana = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];
const turnosTarde = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

export function BookingCalendar() {
  const { setFechaHora, fecha: storedFecha, hora: storedHora } = useBookingStore();
  const [fecha, setFecha] = useState<Date | undefined>(
    storedFecha ? new Date(storedFecha) : undefined
  );
  const [hora, setHora] = useState<string | null>(storedHora);

  // Función para determinar si un día no es laborable o ya pasó
  function isDayDisabled(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    // Fechas pasadas
    if (target < today) return true;

    // 0 = Domingo, 1 = Lunes (Cerrado)
    const dayOfWeek = target.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 1) return true;

    return false;
  }

  // Comprueba si un horario específico ya pasó hoy
  function isTimePassed(slot: string, selectedDate: Date): boolean {
    const now = new Date();
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    if (!isToday) return false;

    const [h, m] = slot.split(":").map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(h, m, 0, 0);

    // Margen de 15 minutos
    return slotTime.getTime() <= now.getTime() + 15 * 60 * 1000;
  }

  function handleSelectDate(d: Date | undefined) {
    if (d && isDayDisabled(d)) return;
    setFecha(d);
    setHora(null);
  }

  function confirmarHora(h: string) {
    if (!fecha) return;
    setHora(h);
    setFechaHora(fecha.toISOString(), h);
  }

  // Verifica si para el día seleccionado quedan horas disponibles
  const horasDisponiblesHoy = useMemo(() => {
    if (!fecha) return [];
    return [...turnosManana, ...turnosTarde].filter((slot) => !isTimePassed(slot, fecha));
  }, [fecha]);

  return (
    <div className="space-y-6">
      {/* Banner informativo de horario oficial */}
      <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Clock className="h-4 w-4 text-secondary shrink-0" />
          <span>
            <strong>Horario de atención:</strong> Martes a Sábado de 8:30 a.m. a 5:30 p.m.
          </span>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
          🚫 Domingos y Lunes cerrado
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Selector de Fecha */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 px-2 text-sm font-semibold text-primary">
            <CalendarIcon className="h-4 w-4" />
            <span>Selecciona una fecha</span>
          </div>

          <Calendar
            mode="single"
            selected={fecha}
            onSelect={handleSelectDate}
            disabled={isDayDisabled}
            className="mx-auto"
          />

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Los domingos y lunes están deshabilitados por descanso del estudio.
          </p>
        </div>

        {/* Selector de Horas */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-primary">
                {fecha ? `Turnos para ${formatDate(fecha)}` : "Elige una fecha para ver horarios"}
              </h3>
              {hora && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3 w-3" />
                  {hora}
                </span>
              )}
            </div>

            {!fecha ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p>Por favor selecciona un día hábil en el calendario de la izquierda (Martes a Sábado).</p>
              </div>
            ) : horasDisponiblesHoy.length === 0 ? (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-6 text-center text-sm text-amber-800">
                <AlertCircle className="mx-auto h-6 w-6 text-amber-600 mb-2" />
                <p className="font-medium">No quedan turnos disponibles para hoy.</p>
                <p className="mt-1 text-xs text-amber-700">
                  El horario de atención es hasta las 5:30 p.m. Por favor escoge un día posterior.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Turno Mañana */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span>Turno Mañana (8:30 a.m. - 12:30 p.m.)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {turnosManana.map((slot) => {
                      const disabled = isTimePassed(slot, fecha);
                      const isSelected = hora === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          onClick={() => confirmarHora(slot)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-medium transition-all text-center",
                            disabled
                              ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-transparent line-through"
                              : isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                              : "border-border hover:bg-secondary hover:text-secondary-foreground"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Turno Tarde */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <Sunset className="h-3.5 w-3.5 text-orange-500" />
                    <span>Turno Tarde (1:00 p.m. - 5:00 p.m.)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {turnosTarde.map((slot) => {
                      const disabled = isTimePassed(slot, fecha);
                      const isSelected = hora === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          onClick={() => confirmarHora(slot)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-medium transition-all text-center",
                            disabled
                              ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-transparent line-through"
                              : isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                              : "border-border hover:bg-secondary hover:text-secondary-foreground"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {fecha && hora && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Cita seleccionada:</span>
              <span className="font-semibold text-foreground">
                {formatDate(fecha)} a las {hora}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
