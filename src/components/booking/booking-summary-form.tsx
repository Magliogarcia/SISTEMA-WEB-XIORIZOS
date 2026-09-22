"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Clock, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";

export function BookingSummaryForm() {
  const router = useRouter();
  const { servicio, profesional, fecha, hora, reset } = useBookingStore();
  const [enviando, setEnviando] = useState(false);

  if (!servicio || !profesional || !fecha || !hora) {
    return (
      <p className="text-sm text-muted-foreground">
        Completa los pasos anteriores para ver el resumen de tu cita.
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      reset();
      router.push("/citas/confirmacion");
    }, 1000);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="clienteNombre">Nombre completo</Label>
          <Input id="clienteNombre" required placeholder="Ej. Carla Méndez" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clienteTelefono">Teléfono</Label>
          <Input id="clienteTelefono" required placeholder="0412-0000000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notas">Notas adicionales (opcional)</Label>
          <Textarea id="notas" placeholder="Alergias, referencias de color, etc." />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={enviando}>
          {enviando ? "Confirmando..." : "Confirmar cita"}
        </Button>
      </form>

      <aside className="h-fit space-y-4 rounded-xl border border-border p-6">
        <h3 className="font-heading text-lg font-semibold">Resumen de la cita</h3>
        <div className="flex items-center gap-3 text-sm">
          <Scissors className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">{servicio.nombre}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(servicio.precio)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User className="h-4 w-4 text-primary" />
          <p>{profesional.nombre}</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <p>{formatDate(new Date(fecha))}</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <p>{hora}</p>
        </div>
        <Separator />
        <div className="flex justify-between font-heading font-bold">
          <span>Total</span>
          <span>{formatCurrency(servicio.precio)}</span>
        </div>
      </aside>
    </div>
  );
}
