"use client";

import { Suspense } from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
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
  const { step, servicio, profesional, fecha, hora, prevStep, nextStep, setStep } = useBookingStore();

  // Comprueba qué pasos están desbloqueados según la información seleccionada
  function isStepClickable(numero: number): boolean {
    if (numero === step) return true;
    if (numero === 1) return true;
    if (numero === 2) return !!servicio;
    if (numero === 3) return !!servicio && !!profesional;
    if (numero === 4) return !!servicio && !!profesional && !!fecha && !!hora;
    return false;
  }

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

      {/* Stepper interactivo: permite hacer clic en pasos anteriores o desbloqueados */}
      <div className="mb-10 flex items-center justify-between">
        {pasos.map((paso, idx) => {
          const clickable = isStepClickable(paso.numero);
          const isCompleted = step > paso.numero;
          const isCurrent = step === paso.numero;

          return (
            <div key={paso.numero} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && setStep(paso.numero)}
                className={cn(
                  "group flex flex-col items-center gap-1.5 transition-all text-left outline-none",
                  clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                )}
                title={clickable ? `Ir al paso ${paso.numero}: ${paso.titulo}` : "Completa los pasos anteriores"}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-all shadow-sm",
                    isCompleted
                      ? "border-primary bg-primary text-on-primary group-hover:scale-110"
                      : isCurrent
                      ? "border-primary text-primary bg-primary/10 ring-2 ring-primary/20 scale-105"
                      : "border-surface-container text-on-surface-variant/60 group-hover:border-primary/50"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : paso.numero}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block transition-colors",
                    isCurrent ? "font-bold text-primary" : "text-on-surface group-hover:text-primary"
                  )}
                >
                  {paso.titulo}
                </span>
              </button>
              {idx < pasos.length - 1 && (
                <div
                  className={cn(
                    "mx-1 sm:mx-2 h-0.5 flex-1 transition-colors",
                    step > paso.numero ? "bg-primary" : "bg-surface-container"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Contenido del paso actual */}
      <div className="min-h-[340px]">
        {step === 1 && <ServiceSelector />}
        {step === 2 && <ProfessionalSelector />}
        {step === 3 && <BookingCalendar />}
        {step === 4 && <BookingSummaryForm />}
      </div>

      {/* Barra de navegación de pasos inferior */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-surface-container">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="rounded-full px-5 flex items-center gap-2 hover:bg-secondary/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Atrás</span>
        </Button>

        {step < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!puedeAvanzar}
            className="rounded-full px-6 bg-primary hover:bg-primary/90 text-on-primary font-semibold flex items-center gap-2 shadow-sm"
          >
            <span>Continuar</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Revisa los datos antes de confirmar tu cita
          </span>
        )}
      </div>
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
