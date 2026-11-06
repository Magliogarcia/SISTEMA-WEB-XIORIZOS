"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Clock,
  User,
  Scissors,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import {
  validateFullName,
  validatePhone,
  filterPhoneInput,
  filterNameInput,
} from "@/lib/validation";

export function BookingSummaryForm() {
  const router = useRouter();
  const { servicio, profesional, fecha, hora, reset, setStep } = useBookingStore();

  const [nombre, setNombre] = useState("");
  const [nombreError, setNombreError] = useState<string | null>(null);

  const [telefono, setTelefono] = useState("");
  const [telefonoError, setTelefonoError] = useState<string | null>(null);

  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  if (!servicio || !profesional || !fecha || !hora) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        <p>Por favor completa los pasos anteriores para ver el resumen de tu cita.</p>
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="mt-4 rounded-full text-xs"
        >
          Ir al paso 1: Seleccionar Servicio
        </Button>
      </div>
    );
  }

  function handleNombreChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filtered = filterNameInput(e.target.value);
    setNombre(filtered);
    if (nombreError) {
      const res = validateFullName(filtered);
      if (res.isValid) setNombreError(null);
    }
  }

  function handleNombreBlur() {
    if (!nombre.trim()) return;
    const res = validateFullName(nombre);
    if (!res.isValid) {
      setNombreError(res.error || "Nombre no válido");
    } else {
      setNombre(res.formatted || nombre);
      setNombreError(null);
    }
  }

  function handleTelefonoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filtered = filterPhoneInput(e.target.value);
    setTelefono(filtered);

    if (filtered.trim().length >= 11) {
      const res = validatePhone(filtered);
      if (res.isValid) {
        setTelefonoError(null);
      }
    }
  }

  function handleTelefonoBlur() {
    if (!telefono.trim()) return;
    const res = validatePhone(telefono);
    if (!res.isValid) {
      setTelefonoError(res.error || "Teléfono inválido");
    } else {
      setTelefono(res.formatted || telefono);
      setTelefonoError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!servicio || !profesional || !fecha || !hora) return;

    const nombreRes = validateFullName(nombre);
    const telefonoRes = validatePhone(telefono);

    let hasErrors = false;

    if (!nombreRes.isValid) {
      setNombreError(nombreRes.error || "Nombre inválido");
      hasErrors = true;
    } else {
      setNombreError(null);
      setNombre(nombreRes.formatted || nombre);
    }

    if (!telefonoRes.isValid) {
      setTelefonoError(telefonoRes.error || "Teléfono inválido");
      hasErrors = true;
    } else {
      setTelefonoError(null);
      setTelefono(telefonoRes.formatted || telefono);
    }

    if (hasErrors) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre: nombreRes.formatted || nombre,
          clienteTelefono: telefonoRes.formatted || telefono,
          servicioNombre: servicio.nombre,
          servicioPrecio: servicio.precio,
          duracionMin: servicio.duracionMin,
          profesionalNombre: profesional.nombre,
          fecha,
          hora,
          notas: notas.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorGeneral(data.error || "No se pudo agendar la cita. Por favor verifica el horario.");
        setEnviando(false);
        return;
      }

      reset();
      router.push("/citas/confirmacion");
    } catch (err) {
      console.error("Error al guardar cita:", err);
      setErrorGeneral("Error de conexión al procesar la cita. Inténtalo nuevamente.");
      setEnviando(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-primary">Tus datos de contacto</h2>

        {errorGeneral && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 flex items-start gap-2.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Conflicto en la agenda</p>
              <p className="mt-0.5">{errorGeneral}</p>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="mt-2 inline-flex items-center gap-1 font-semibold underline hover:no-underline"
              >
                Volver al paso 3 y elegir otro horario
              </button>
            </div>
          </div>
        )}

        {/* Campo Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="clienteNombre" className="text-sm font-semibold">
            Nombre y Apellido <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clienteNombre"
            required
            value={nombre}
            onChange={handleNombreChange}
            onBlur={handleNombreBlur}
            placeholder="Ej. Carla Méndez"
            className={nombreError ? "border-destructive focus-visible:ring-destructive" : ""}
            autoComplete="name"
          />
          {nombreError && (
            <p className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{nombreError}</span>
            </p>
          )}
        </div>

        {/* Campo Teléfono */}
        <div className="space-y-1.5">
          <Label htmlFor="clienteTelefono" className="text-sm font-semibold">
            Teléfono Celular <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clienteTelefono"
            required
            type="tel"
            value={telefono}
            onChange={handleTelefonoChange}
            onBlur={handleTelefonoBlur}
            placeholder="0412 1234567"
            className={telefonoError ? "border-destructive focus-visible:ring-destructive" : ""}
            autoComplete="tel"
          />
          {telefonoError && (
            <p className="flex items-start gap-1 text-xs text-destructive mt-1 font-medium">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{telefonoError}</span>
            </p>
          )}
        </div>

        {/* Campo Notas */}
        <div className="space-y-1.5">
          <Label htmlFor="notas" className="text-sm font-semibold">
            Notas o indicaciones para tu cita (opcional)
          </Label>
          <Textarea
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="¿Tienes alguna preferencia, alergia o historial de decoloración reciente?"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-semibold py-6 rounded-xl shadow-md"
          disabled={enviando}
        >
          {enviando ? "Agendando cita..." : "Confirmar mi cita"}
        </Button>
      </form>

      {/* Resumen lateral con botones directos para editar cada paso */}
      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-primary">Resumen de la cita</h3>
          <span className="text-[11px] text-muted-foreground font-medium">Editable</span>
        </div>

        <div className="space-y-3 pt-2">
          {/* Servicio */}
          <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="flex items-start gap-2.5 text-sm">
              <Scissors className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-xs sm:text-sm">{servicio.nombre}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(servicio.precio)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary transition-colors shrink-0"
              title="Cambiar servicio"
            >
              <Pencil className="h-3 w-3" />
              <span>Cambiar</span>
            </button>
          </div>

          {/* Profesional */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="flex items-center gap-2.5 text-sm">
              <User className="h-4 w-4 text-secondary shrink-0" />
              <div>
                <p className="text-[11px] text-muted-foreground">Especialista</p>
                <p className="font-medium text-foreground text-xs sm:text-sm">{profesional.nombre}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary transition-colors shrink-0"
              title="Cambiar especialista"
            >
              <Pencil className="h-3 w-3" />
              <span>Cambiar</span>
            </button>
          </div>

          {/* Fecha y Hora */}
          <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="flex items-start gap-2.5 text-sm">
              <CalendarCheck className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-xs sm:text-sm">{formatDate(new Date(fecha))}</p>
                <div className="flex items-center gap-1 text-xs text-primary font-semibold mt-0.5">
                  <Clock className="h-3 w-3 text-secondary" />
                  <span>{hora}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary transition-colors shrink-0"
              title="Cambiar fecha u hora"
            >
              <Pencil className="h-3 w-3" />
              <span>Cambiar</span>
            </button>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-baseline font-heading">
          <span className="text-sm font-medium text-muted-foreground">Total estimado</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(servicio.precio)}</span>
        </div>

        <div className="rounded-lg bg-muted/60 p-3 text-[11px] text-muted-foreground">
          ℹ️ Podrás realizar el pago en el salón por transferencia, punto, efectivo o en cuotas con <strong>Cashea</strong>.
        </div>
      </aside>
    </div>
  );
}
