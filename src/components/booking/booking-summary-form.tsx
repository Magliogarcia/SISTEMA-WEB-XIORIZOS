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
  Landmark,
  Banknote,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import {
  validateFullName,
  validatePhone,
  filterPhoneInput,
  filterNameInput,
} from "@/lib/validation";

const BANCOS_VENEZUELA = [
  "Banesco",
  "Banco de Venezuela (BDV)",
  "Mercantil",
  "BBVA Provincial",
  "Bancamiga",
  "Banco Nacional de Crédito (BNC)",
  "Bancaribe",
  "Banco Exterior",
  "Otro banco nacional",
];

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

  // Estados del abono del 20%
  const [metodoPago, setMetodoPago] = useState<"pagomovil" | "efectivo">("pagomovil");
  const [banco, setBanco] = useState("");
  const [bancoError, setBancoError] = useState<string | null>(null);
  const [referencia, setReferencia] = useState("");
  const [referenciaError, setReferenciaError] = useState<string | null>(null);

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

  // Cálculos de reserva: 20% abono y 80% restante en salón
  const precioTotal = servicio.precio;
  const montoReserva = Math.round(precioTotal * 0.20 * 100) / 100;
  const montoRestante = Math.round((precioTotal - montoReserva) * 100) / 100;

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

    // Validación del método de abono del 20%
    if (metodoPago === "pagomovil") {
      if (!banco) {
        setBancoError("Selecciona el banco desde el que realizaste el Pago Móvil.");
        hasErrors = true;
      } else {
        setBancoError(null);
      }

      const refClean = referencia.trim();
      if (!refClean || refClean.length < 4) {
        setReferenciaError("Ingresa el número de referencia del Pago Móvil (mínimo 4 dígitos).");
        hasErrors = true;
      } else {
        setReferenciaError(null);
      }
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
          montoReserva,
          montoRestante,
          duracionMin: servicio.duracionMin,
          profesionalNombre: profesional.nombre,
          fecha,
          hora,
          notas: notas.trim(),
          metodoPago,
          pagoMovil:
            metodoPago === "pagomovil"
              ? { banco, referencia: referencia.trim() }
              : undefined,
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
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm">
        <div>
          <h2 className="font-heading text-lg font-bold text-primary">Tus datos de contacto</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ingresa tus datos reales para coordinar la cita y enviar tu confirmación.
          </p>
        </div>

        {errorGeneral && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 flex items-start gap-2.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Atención en tu reserva</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo Nombre */}
          <div className="space-y-1.5 sm:col-span-1">
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
          <div className="space-y-1.5 sm:col-span-1">
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
            rows={2}
          />
        </div>

        {/* SECCIÓN DEL 20% DE RESERVA */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-secondary/10 border border-secondary/20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Reserva requerida (20%)
              </p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                Para asegurar tu cita se abona el 20% del servicio
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(montoReserva)}
              </span>
              <p className="text-[11px] text-muted-foreground">
                Resta en salón: {formatCurrency(montoRestante)}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              ¿Cómo deseas abonar el 20% de tu reserva? <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Selecciona tu método de pago para completar la reserva del turno.
            </p>
          </div>

          {/* Opciones de pago: Pago Móvil o Efectivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMetodoPago("pagomovil")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                metodoPago === "pagomovil"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border hover:bg-secondary/10"
              )}
            >
              <Landmark className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Pago Móvil</p>
                <p className="text-xs text-muted-foreground">Abona {formatCurrency(montoReserva)} al instante</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago("efectivo")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                metodoPago === "efectivo"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border hover:bg-secondary/10"
              )}
            >
              <Banknote className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Efectivo en Salón</p>
                <p className="text-xs text-muted-foreground">Abono previo en recepción</p>
              </div>
            </button>
          </div>

          {/* Formulario Pago Móvil si está seleccionado */}
          {metodoPago === "pagomovil" ? (
            <div className="space-y-3.5 rounded-xl bg-secondary/5 p-4 sm:p-5 border border-secondary/20">
              {/* Datos oficiales de Pago Móvil de Xiorizos */}
              <div className="rounded-lg bg-card p-3.5 border border-border text-xs space-y-1.5">
                <p className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-secondary shrink-0" />
                  <span>Datos oficiales para transferir el 20% ({formatCurrency(montoReserva)}):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-foreground">
                  <p><strong>Banco:</strong> Banesco (0134)</p>
                  <p><strong>Teléfono:</strong> 0412 1234567</p>
                  <p><strong>Cédula / RIF:</strong> V-12.345.678</p>
                  <p><strong>Titular:</strong> Estudio Xiorizos C.A.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Banco emisor */}
                <div className="space-y-1">
                  <Label htmlFor="bancoPago" className="text-xs font-semibold">
                    Banco de origen <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={banco}
                    onValueChange={(val) => {
                      setBanco(val);
                      if (bancoError) setBancoError(null);
                    }}
                  >
                    <SelectTrigger id="bancoPago" className={bancoError ? "border-destructive text-xs" : "text-xs"}>
                      <SelectValue placeholder="Selecciona tu banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANCOS_VENEZUELA.map((b) => (
                        <SelectItem key={b} value={b} className="text-xs">
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {bancoError && (
                    <p className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{bancoError}</span>
                    </p>
                  )}
                </div>

                {/* Número de referencia */}
                <div className="space-y-1">
                  <Label htmlFor="referenciaPago" className="text-xs font-semibold">
                    Número de referencia <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="referenciaPago"
                    required
                    value={referencia}
                    onChange={(e) => {
                      // Permitir solo números y letras de referencia bancaria
                      const val = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
                      setReferencia(val);
                      if (referenciaError && val.length >= 4) setReferenciaError(null);
                    }}
                    placeholder="Ej. 948271 (últimos dígitos)"
                    className={cn("text-xs font-mono", referenciaError ? "border-destructive" : "")}
                  />
                  {referenciaError && (
                    <p className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{referenciaError}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-card p-4 border border-border text-xs text-muted-foreground flex items-start gap-2.5">
              <Banknote className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-xs">Abono del 20% en recepción</p>
                <p className="mt-0.5 leading-relaxed">
                  Podrás abonar los <strong>{formatCurrency(montoReserva)}</strong> en efectivo (divisas o bolívares) directamente en el estudio antes del día de tu cita.
                </p>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-semibold py-6 rounded-xl shadow-md cursor-pointer"
          disabled={enviando}
        >
          {enviando ? "Confirmando reserva..." : `Reservar mi cita con 20% (${formatCurrency(montoReserva)})`}
        </Button>
      </form>

      {/* Resumen lateral con desglose del 20% y 80% */}
      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-primary">Resumen de la cita</h3>
          <span className="text-[11px] text-muted-foreground font-medium">Editable</span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Servicio */}
          <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="flex items-start gap-2.5 text-sm">
              <Scissors className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-xs sm:text-sm">{servicio.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  Duración aprox: {servicio.duracionMin} min
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary transition-colors shrink-0 cursor-pointer"
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
              className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary transition-colors shrink-0 cursor-pointer"
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
              className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary transition-colors shrink-0 cursor-pointer"
              title="Cambiar fecha u hora"
            >
              <Pencil className="h-3 w-3" />
              <span>Cambiar</span>
            </button>
          </div>
        </div>

        <Separator />

        {/* Desglose Financiero con 20% de reserva */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Costo total del servicio:</span>
            <span className="font-semibold text-foreground">{formatCurrency(precioTotal)}</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Reserva a pagar hoy (20%):</span>
            </span>
            <span className="text-sm">{formatCurrency(montoReserva)}</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground pt-1">
            <span>Resta a cancelar en el salón (80%):</span>
            <span className="font-bold text-foreground">{formatCurrency(montoRestante)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
          ℹ️ Para agendar y reservar tu cita se requiere el <strong>20% del costo total</strong>. El 80% restante lo pagarás en el salón el día de tu atención por transferencia, tarjeta, efectivo o en cuotas con <strong>Cashea</strong>.
        </div>
      </aside>
    </div>
  );
}
