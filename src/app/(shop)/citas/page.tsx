"use client";

import { Suspense } from "react";
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

function CitasWizardContent() {
  const { step, servicio, profesional, fecha, hora, prevStep, nextStep } = useBookingStore();

  const puedeAvanzar =
    (step === 1 && !!servicio) ||
    (step === 2 && !!profesional) ||
    (step === 3 && !!fecha && !!hora);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
          Estudio Xiorizos Naguanagua
        </span>
        <h1 className="mt-2 font-headline-lg text-3xl sm:text-4xl font-bold text-primary">
          Agenda tu Experiencia
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Horario de atención: Martes a Sábado de 8:30 a.m. a 5:30 p.m. Domingos y lunes cerrado.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-10 flex items-center justify-between">
        {pasos.map((paso, idx) => (
          <div key={paso.numero} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  step > paso.numero
                    ? "border-primary bg-primary text-on-primary"
                    : step === paso.numero
                    ? "border-primary text-primary bg-primary/10"
                    : "border-surface-container text-on-surface-variant/60"
                )}
              >
                {step > paso.numero ? <Check className="h-4 w-4" /> : paso.numero}
              </div>
              <span className="hidden text-xs font-medium sm:block text-on-surface">{paso.titulo}</span>
            </div>
            {idx < pasos.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 transition-colors",
                  step > paso.numero ? "bg-primary" : "bg-surface-container"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[340px]">
        {step === 1 && <ServiceSelector />}
        {step === 2 && <ProfessionalSelector />}
        {step === 3 && <BookingCalendar />}
        {step === 4 && <BookingSummaryForm />}
      </div>

      {step < 4 && (
        <div className="mt-8 flex justify-between pt-6 border-t border-surface-container">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="rounded-full px-6"
          >
            Atrás
          </Button>
          <Button
            onClick={nextStep}
            disabled={!puedeAvanzar}
            className="rounded-full px-7 bg-primary hover:bg-primary/90 text-on-primary font-semibold"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CitasPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-sm text-on-surface-variant">Cargando reserva...</div>}>
      <CitasWizardContent />
    </Suspense>
  );
}
