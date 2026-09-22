"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ServiceSelector } from "@/components/booking/service-selector";
import { ProfessionalSelector } from "@/components/booking/professional-selector";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingSummaryForm } from "@/components/booking/booking-summary-form";
import { useBookingStore } from "@/store/booking-store";

const pasos = [
  { numero: 1, titulo: "Servicio" },
  { numero: 2, titulo: "Profesional" },
  { numero: 3, titulo: "Fecha y hora" },
  { numero: 4, titulo: "Confirmación" },
];

export default function CitasPage() {
  const { step, servicio, profesional, fecha, hora, prevStep, nextStep } = useBookingStore();

  const puedeAvanzar =
    (step === 1 && !!servicio) ||
    (step === 2 && !!profesional) ||
    (step === 3 && !!fecha && !!hora);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-heading text-3xl font-bold">Agenda tu cita</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Sigue los pasos para reservar con tu profesional favorito.
      </p>

      <div className="mb-10 flex items-center justify-between">
        {pasos.map((paso, idx) => (
          <div key={paso.numero} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  step > paso.numero
                    ? "border-primary bg-primary text-primary-foreground"
                    : step === paso.numero
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {step > paso.numero ? <Check className="h-4 w-4" /> : paso.numero}
              </div>
              <span className="hidden text-xs font-medium sm:block">{paso.titulo}</span>
            </div>
            {idx < pasos.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1", step > paso.numero ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[320px]">
        {step === 1 && <ServiceSelector />}
        {step === 2 && <ProfessionalSelector />}
        {step === 3 && <BookingCalendar />}
        {step === 4 && <BookingSummaryForm />}
      </div>

      {step < 4 && (
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Atrás
          </Button>
          <Button onClick={nextStep} disabled={!puedeAvanzar}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
}
