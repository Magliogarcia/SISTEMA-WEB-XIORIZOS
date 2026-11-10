import Link from "next/link";
import { Clock, ShieldCheck, Store, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmacionCitaPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-32 pb-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-sm border border-amber-500/20">
        <Clock className="h-8 w-8 text-amber-600 animate-pulse" />
      </div>

      <span className="mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
        Pendiente por comprobación de pago
      </span>

      <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-primary">
        Solicitud de Reserva Registrada
      </h1>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Tu cita no se registra de forma automática. Se te confirmará tu registro oficialmente una vez que nuestro personal compruebe el pago de la reserva y <strong>se te notificará directamente por WhatsApp</strong>.
      </p>

      {/* Tarjeta destacada de Notificación WhatsApp */}
      <div className="mt-6 w-full rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-xs text-left space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
          <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Notificación oficial por WhatsApp</span>
        </div>
        <p className="text-foreground leading-relaxed">
          Revisaremos los 8 dígitos de tu referencia de Pago Móvil y tu teléfono emisor. En cuanto el pago sea comprobado, recibirás en tu WhatsApp el mensaje de confirmación con la fecha, hora y especialista asignado.
        </p>
        <p className="text-muted-foreground pt-1 border-t border-emerald-500/15">
          • <strong>80% restante:</strong> Lo cancelarás el día de tu cita en el estudio (efectivo, punto, transferencia o Cashea).
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <Button className="w-full sm:w-auto rounded-full bg-primary hover:bg-secondary text-on-primary px-6 font-semibold" asChild>
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
