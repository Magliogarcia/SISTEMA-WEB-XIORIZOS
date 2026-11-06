import Link from "next/link";
import { CalendarCheck, ShieldCheck, ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmacionCitaPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-32 pb-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-sm border border-emerald-500/20">
        <CalendarCheck className="h-8 w-8 text-emerald-600" />
      </div>

      <h1 className="mt-5 font-heading text-2xl sm:text-3xl font-bold text-primary">
        ¡Tu cita ha sido agendada con éxito!
      </h1>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Hemos registrado tu cita en el sistema con el <strong>20% de reserva</strong>. Nuestro equipo de recepción validará tu abono y te enviará la confirmación final por WhatsApp.
      </p>

      {/* Tarjeta de recordatorio del 80% restante */}
      <div className="mt-6 w-full rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-xs text-left space-y-2">
        <div className="flex items-center gap-2 font-bold text-primary text-sm">
          <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
          <span>Detalles del pago y atención:</span>
        </div>
        <p className="text-foreground">
          • <strong>Abono 20%:</strong> Registrado para apartar tu turno con el especialista.
        </p>
        <p className="text-foreground">
          • <strong>Resta 80%:</strong> Lo cancelarás el día de tu cita directamente en el salón (efectivo, punto, transferencia o Cashea).
        </p>
        <p className="text-muted-foreground pt-1 border-t border-secondary/15">
          📍 Torre Anexa del Centro Científico Metropolitano del Norte, Naguanagua.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <Button className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-on-primary px-6 font-semibold" asChild>
          <Link href="/">
            <span>Volver al inicio</span>
          </Link>
        </Button>
        <Button variant="outline" className="w-full sm:w-auto rounded-full px-6" asChild>
          <Link href="/catalogo" className="flex items-center gap-1.5">
            <Store className="h-4 w-4" />
            <span>Ver productos para rizos</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
