"use client";

import { useState, useEffect } from "react";
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
  Copy,
  Check,
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
import { useAuthStore } from "@/store/auth-store";
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
  const { user } = useAuthStore();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [nombreError, setNombreError] = useState<string | null>(null);

  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [telefonoError, setTelefonoError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!nombre && user.nombre) setNombre(user.nombre);
      if (!telefono && user.telefono) setTelefono(user.telefono);
    }
  }, [user]);

  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviadoExitoso, setEnviadoExitoso] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  // Estados del abono del 20%
  const [metodoPago, setMetodoPago] = useState<"pagomovil" | "efectivo">("pagomovil");
  const [banco, setBanco] = useState("");
  const [bancoError, setBancoError] = useState<string | null>(null);
  const [referencia, setReferencia] = useState("");
  const [referenciaError, setReferenciaError] = useState<string | null>(null);
  const [telefonoEmisor, setTelefonoEmisor] = useState("");
  const [telefonoEmisorError, setTelefonoEmisorError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleCopiarDatos = () => {
    const texto = `BNC (0191)\n30709751\n04145812979`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

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

    let firstErrorId: string | null = null;

    if (!nombreRes.isValid) {
      setNombreError(nombreRes.error || "Nombre inválido");
      firstErrorId = "clienteNombre";
      hasErrors = true;
    } else {
      setNombreError(null);
      setNombre(nombreRes.formatted || nombre);
    }

    if (!telefonoRes.isValid) {
      setTelefonoError(telefonoRes.error || "Teléfono inválido");
      if (!firstErrorId) firstErrorId = "clienteTelefono";
      hasErrors = true;
    } else {
      setTelefonoError(null);
      setTelefono(telefonoRes.formatted || telefono);
    }

    // Validación del método de abono del 20%
    if (metodoPago === "pagomovil") {
      if (!banco) {
        setBancoError("Selecciona el banco desde el que realizaste el Pago Móvil.");
        if (!firstErrorId) firstErrorId = "bancoPago";
        hasErrors = true;
      } else {
        setBancoError(null);
      }

      const refClean = referencia.replace(/\D/g, "");
      if (!refClean || refClean.length !== 8) {
        setReferenciaError("El número de referencia debe contener 8 dígitos numéricos.");
        if (!firstErrorId) firstErrorId = "referenciaPago";
        hasErrors = true;
      } else {
        setReferenciaError(null);
      }

      if (!telefonoEmisor.trim()) {
        setTelefonoEmisorError("El teléfono emisor del Pago Móvil es obligatorio.");
        if (!firstErrorId) firstErrorId = "telefonoEmisorPago";
        hasErrors = true;
      } else {
        const telEmisorRes = validatePhone(telefonoEmisor);
        if (!telEmisorRes.isValid) {
          setTelefonoEmisorError(telEmisorRes.error || "Número de teléfono emisor inválido.");
          if (!firstErrorId) firstErrorId = "telefonoEmisorPago";
          hasErrors = true;
        } else {
          setTelefonoEmisorError(null);
          setTelefonoEmisor(telEmisorRes.formatted || telefonoEmisor);
        }
      }
    }

    if (hasErrors) {
      if (firstErrorId) {
        const el = document.getElementById(firstErrorId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
          return;
        }
      }
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

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
              ? {
                banco,
                referencia: referencia.replace(/\D/g, "").slice(0, 8),
                telefonoEmisor: telefonoEmisor.trim(),
              }
              : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorGeneral(data.error || "No se pudo agendar la cita. Por favor verifica el horario.");
        setEnviando(false);
        return;
      }

      setEnviadoExitoso(true);
      router.push("/citas/confirmacion");
    } catch (err) {
      console.error("Error al guardar cita:", err);
      setErrorGeneral("Error de conexión al procesar la cita. Inténtalo nuevamente.");
      setEnviando(false);
    }
  }

  if (enviadoExitoso) {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-8 sm:p-12 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
          <CheckCircle2 className="h-10 w-10 animate-in zoom-in-50 duration-300" />
        </div>
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-200/60 text-emerald-900">
            Solicitud Registrada
          </span>
          <h3 className="font-heading text-2xl font-bold text-emerald-950">
            ¡Tu cita ha sido enviada a comprobación!
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Estamos transfiriéndote a tu comprobante oficial para que veas los detalles. Por favor espera un momento...
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-4 py-2 rounded-full border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Redirigiendo a confirmación...</span>
          </div>
        </div>
      </div>
    );
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

        {/* SECCIÓN DEL 20% DE RESERVA - CONCISA Y CLARA */}
        <div className="pt-4 border-t border-border space-y-3.5">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF6F2] border border-[#E8DCD1]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                Abono de Reserva (20%)
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Resta en salón: <strong className="text-foreground">{formatCurrency(montoRestante)}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-secondary">
                {formatCurrency(montoReserva)}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              Método para abonar el 20% <span className="text-destructive">*</span>
            </Label>
          </div>

          {/* Opciones de pago: Pago Móvil o Efectivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMetodoPago("pagomovil")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                metodoPago === "pagomovil"
                  ? "border-secondary bg-secondary/5 ring-1 ring-secondary shadow-xs"
                  : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <Landmark className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Pago Móvil</p>
                <p className="text-[11px] text-muted-foreground">Transferir {formatCurrency(montoReserva)}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago("efectivo")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                metodoPago === "efectivo"
                  ? "border-secondary bg-secondary/5 ring-1 ring-secondary shadow-xs"
                  : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <Banknote className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Efectivo en Salón</p>
                <p className="text-[11px] text-muted-foreground">Abonar en recepción</p>
              </div>
            </button>
          </div>

          {/* Formulario Pago Móvil si está seleccionado */}
          {metodoPago === "pagomovil" ? (
            <div className="space-y-3.5 rounded-sm bg-secondary/5 p-4 sm:p-5 border border-secondary/20">
              {/* Datos oficiales de Pago Móvil de Xiorizos */}
              <div className="rounded-sm bg-card p-3.5 border border-border text-xs space-y-2">
                <p className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-secondary shrink-0" />
                  <span>Datos oficiales para transferir el 20% ({formatCurrency(montoReserva)}):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-foreground">
                  <p><strong>Banco:</strong> BNC (0191)</p>
                  <p><strong>Teléfono:</strong> 0414 5812979</p>
                  <p><strong>Cédula / RIF:</strong> 30709751</p>
                  <p><strong>Titular:</strong> Estudio Xiorizos C.A.</p>
                </div>
                <div className="pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={handleCopiarDatos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                  >
                    {copiado ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        <span>¡Datos copiados!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar datos</span>
                      </>
                    )}
                  </button>
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
                    maxLength={8}
                    value={referencia}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                      setReferencia(val);
                      if (referenciaError && val.length === 8) setReferenciaError(null);
                    }}
                    placeholder="Ej. 12345678"
                    className={cn("text-xs font-mono", referenciaError ? "border-destructive" : "")}
                  />
                  {referenciaError && (
                    <p className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{referenciaError}</span>
                    </p>
                  )}
                </div>

                {/* Teléfono emisor del pago móvil (obligatorio) */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="telefonoEmisorPago" className="text-xs font-semibold">
                    Teléfono emisor del Pago Móvil <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="telefonoEmisorPago"
                    required
                    type="tel"
                    value={telefonoEmisor}
                    onChange={(e) => {
                      const val = filterPhoneInput(e.target.value);
                      setTelefonoEmisor(val);
                      if (telefonoEmisorError) setTelefonoEmisorError(null);
                    }}
                    placeholder="0412 1234567"
                    className={cn("text-xs font-mono", telefonoEmisorError ? "border-destructive" : "")}
                  />
                  {telefonoEmisorError && (
                    <p className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{telefonoEmisorError}</span>
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

        <div className="space-y-2.5 pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full text-sm font-bold py-5 rounded-xl shadow-md cursor-pointer bg-gradient-to-r from-[#6E3D21] to-[#855230] hover:from-[#5C3016] hover:to-[#734323] text-white transition-all shadow-[#6E3D21]/20"
            disabled={enviando}
          >
            {enviando ? "Registrando solicitud..." : `Confirmar Cita (${formatCurrency(montoReserva)})`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            🔔 Te notificaremos directamente por <strong>WhatsApp</strong> al comprobar tu abono.
          </p>
        </div>
      </form>

      {/* Resumen lateral simplificado y conciso */}
      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-heading text-base font-bold text-slate-900">Resumen de la Cita</h3>
          <span className="text-[11px] text-secondary font-semibold">Paso 4 de 4</span>
        </div>

        <div className="space-y-2.5">
          {/* Servicio */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">{servicio.nombre}</p>
              <p className="text-[11px] text-slate-500">{servicio.duracionMin} min aprox.</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[11px] font-semibold text-secondary hover:underline shrink-0"
            >
              Cambiar
            </button>
          </div>

          {/* Profesional */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Especialista</p>
              <p className="text-xs font-bold text-slate-800">{profesional.nombre}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[11px] font-semibold text-secondary hover:underline shrink-0"
            >
              Cambiar
            </button>
          </div>

          {/* Fecha y Hora */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800">{formatDate(new Date(fecha))}</p>
              <p className="text-xs font-semibold text-secondary">{hora}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-[11px] font-semibold text-secondary hover:underline shrink-0"
            >
              Cambiar
            </button>
          </div>
        </div>

        <Separator />

        {/* Desglose de Pago Claro y Simplificado */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between items-center text-slate-600">
            <span>Costo total del servicio:</span>
            <span className="font-bold text-slate-900 text-sm">{formatCurrency(precioTotal)}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#FAF6F2] border border-[#E8DCD1] text-secondary font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Abono requerido hoy (20%):</span>
            </span>
            <span className="text-sm font-black">{formatCurrency(montoReserva)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 pt-1">
            <span>Resta en salón al atenderte (80%):</span>
            <span className="font-bold text-slate-900">{formatCurrency(montoRestante)}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-100">
          El 80% restante lo pagarás en el salón el día de tu cita (efectivo, punto o transferencia).
        </p>
      </aside>
    </div>
  );
}
