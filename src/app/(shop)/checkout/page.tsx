"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Landmark, Banknote, AlertCircle, CheckCircle2, Lock, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import {
  validateFullName,
  validatePhone,
  validateEmail,
  validateAddress,
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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [metodoPago, setMetodoPago] = useState<"pagomovil" | "efectivo">("pagomovil");
  const [enviando, setEnviando] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState<string | null>(null);

  // Form states
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [nombreError, setNombreError] = useState<string | null>(null);

  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [telefonoError, setTelefonoError] = useState<string | null>(null);

  const [email, setEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [direccion, setDireccion] = useState("");
  const [direccionError, setDireccionError] = useState<string | null>(null);

  // Pago Móvil states
  const [banco, setBanco] = useState("");
  const [bancoError, setBancoError] = useState<string | null>(null);

  const [referencia, setReferencia] = useState("");
  const [referenciaError, setReferenciaError] = useState<string | null>(null);

  const [telefonoEmisor, setTelefonoEmisor] = useState("");
  const [telefonoEmisorError, setTelefonoEmisorError] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const total = getTotal();

  // Si el usuario inicia sesión posteriormente, actualizar datos
  useEffect(() => {
    if (user) {
      if (!nombre && user.nombre) setNombre(user.nombre);
      if (!email && user.email) setEmail(user.email);
      if (!telefono && user.telefono) setTelefono(user.telefono);
    }
  }, [user, nombre, email, telefono]);

  function handleNombreChange(val: string) {
    const clean = filterNameInput(val);
    setNombre(clean);
    if (nombreError && validateFullName(clean).isValid) setNombreError(null);
  }

  function handleTelefonoChange(val: string) {
    const clean = filterPhoneInput(val);
    setTelefono(clean);
    if (clean.length >= 11) {
      const res = validatePhone(clean);
      if (res.isValid) setTelefonoError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    let hasErrors = false;

    let firstErrorId: string | null = null;

    // Validar nombre
    const resNombre = validateFullName(nombre);
    if (!resNombre.isValid) {
      setNombreError(resNombre.error || "Nombre inválido");
      firstErrorId = "nombre";
      hasErrors = true;
    } else {
      setNombreError(null);
      setNombre(resNombre.formatted || nombre);
    }

    // Validar teléfono
    const resTel = validatePhone(telefono);
    if (!resTel.isValid) {
      setTelefonoError(resTel.error || "Teléfono inválido");
      if (!firstErrorId) firstErrorId = "telefono";
      hasErrors = true;
    } else {
      setTelefonoError(null);
      setTelefono(resTel.formatted || telefono);
    }

    // Validar correo
    const resEmail = validateEmail(email);
    if (!resEmail.isValid) {
      setEmailError(resEmail.error || "Correo inválido");
      if (!firstErrorId) firstErrorId = "email";
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    // Validar dirección
    const resDir = validateAddress(direccion);
    if (!resDir.isValid) {
      setDireccionError(resDir.error || "Dirección inválida");
      if (!firstErrorId) firstErrorId = "direccion";
      hasErrors = true;
    } else {
      setDireccionError(null);
    }

    // Validar Pago Móvil si es el método elegido
    if (metodoPago === "pagomovil") {
      if (!banco) {
        setBancoError("Selecciona el banco desde el que realizaste el pago móvil.");
        if (!firstErrorId) firstErrorId = "banco";
        hasErrors = true;
      } else {
        setBancoError(null);
      }

      const refClean = referencia.replace(/\D/g, "");
      if (!refClean || refClean.length !== 8) {
        setReferenciaError("El número de referencia debe contener 8 dígitos numéricos.");
        if (!firstErrorId) firstErrorId = "referencia";
        hasErrors = true;
      } else {
        setReferenciaError(null);
      }

      if (!telefonoEmisor.trim()) {
        setTelefonoEmisorError("El teléfono emisor del pago móvil es obligatorio.");
        if (!firstErrorId) firstErrorId = "telefonoEmisor";
        hasErrors = true;
      } else {
        const telEmisorRes = validatePhone(telefonoEmisor);
        if (!telEmisorRes.isValid) {
          setTelefonoEmisorError(telEmisorRes.error || "Teléfono emisor inválido.");
          if (!firstErrorId) firstErrorId = "telefonoEmisor";
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

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre: resNombre.formatted || nombre,
          clienteTelefono: resTel.formatted || telefono,
          clienteEmail: email.trim(),
          direccion: direccion.trim(),
          items: items.map((i) => ({
            productId: i.product.id,
            nombre: i.product.nombre,
            precio: i.product.precio,
            cantidad: i.cantidad,
            imagenUrl: i.product.imagenUrl,
          })),
          total,
          metodoPago,
          pagoMovil:
            metodoPago === "pagomovil"
              ? {
                  banco,
                  referencia: referencia.trim(),
                  telefonoEmisor: telefonoEmisor.trim() || telefono,
                }
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "No se pudo procesar el pedido. Intenta de nuevo.");
        setEnviando(false);
        return;
      }

      setPedidoExitoso(data.pedido.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorGeneral("Error de conexión al registrar el pedido. Inténtalo nuevamente.");
      setEnviando(false);
    }
  }

  if (pedidoExitoso) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-36 pb-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          {metodoPago === "pagomovil" ? "Pendiente por Comprobación de Pago" : "Orden Registrada"}
        </span>

        <h1 className="mt-3 font-heading text-2xl font-bold text-primary">
          ¡Orden {pedidoExitoso} registrada!
        </h1>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {metodoPago === "pagomovil"
            ? "Tu orden no queda confirmada de forma automática. Nuestro personal administrativo comprobará tu Pago Móvil y se te confirmará la compra notificándote directamente por WhatsApp a tu número de contacto."
            : "Tu orden ha sido registrada para pago en efectivo al momento de la entrega o al retirar personalmente en el estudio en Naguanagua."}
        </p>

        {metodoPago === "pagomovil" && (
          <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-xs text-left space-y-1.5">
            <p className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
              <span>🔔 Notificación por WhatsApp:</span>
            </p>
            <p className="text-foreground leading-relaxed">
              En cuanto el personal verifique tu referencia de Pago Móvil y el teléfono emisor, recibirás un mensaje en tu WhatsApp confirmando el despacho o disponibilidad de tu paquete.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => router.push("/catalogo")} className="rounded-full bg-primary hover:bg-secondary text-white font-semibold">
            Volver a la tienda
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 pt-36 pb-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-muted-foreground">Agrega productos antes de continuar al pago.</p>
        <Button className="mt-6 rounded-full" onClick={() => router.push("/catalogo")}>
          Ir al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-primary">Finalizar compra</h1>

      {/* Bloque de inicio de sesión obligatorio */}
      {!isAuthenticated && (
        <div className="mb-8 rounded-2xl border border-secondary/30 bg-secondary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-primary">
                Inicia sesión para realizar tu compra
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Para asociar tu pedido y verificar tu pago móvil de forma segura debes tener una cuenta activa.
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/login?redirect=/checkout")}
            className="rounded-full flex items-center gap-2 whitespace-nowrap bg-primary hover:bg-secondary text-white"
          >
            <span>Iniciar sesión</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {errorGeneral && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3.5 text-xs font-medium text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorGeneral}</span>
            </div>
          )}

          {/* Datos del Cliente */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-semibold text-primary">
              Datos de contacto y entrega
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Nombre */}
              <div className="space-y-1.5">
                <Label htmlFor="nombre" className="text-sm font-semibold">
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  placeholder="Ej. Ana Pérez"
                  className={nombreError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {nombreError && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{nombreError}</span>
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <Label htmlFor="telefono" className="text-sm font-semibold">
                  Teléfono Celular <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telefono"
                  required
                  type="tel"
                  value={telefono}
                  onChange={(e) => handleTelefonoChange(e.target.value)}
                  placeholder="0412 1234567"
                  className={telefonoError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {telefonoError && (
                  <p className="flex items-start gap-1 text-xs text-destructive mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{telefonoError}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="ana@correo.com"
                  className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {emailError && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="direccion" className="text-sm font-semibold">
                  Dirección de entrega <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="direccion"
                  required
                  value={direccion}
                  onChange={(e) => {
                    setDireccion(e.target.value);
                    if (direccionError) setDireccionError(null);
                  }}
                  placeholder="Av. Universidad, Res. El Trigal, Naguanagua, Valencia"
                  className={direccionError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {direccionError && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{direccionError}</span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Opciones de Pago (Solo Efectivo o Pago Móvil) */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Método de pago</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selecciona si pagarás mediante Pago Móvil o en Efectivo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMetodoPago("pagomovil")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  metodoPago === "pagomovil"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:bg-secondary/10"
                )}
              >
                <Landmark className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Pago Móvil</p>
                  <p className="text-xs text-muted-foreground">Transferencia interbancaria inmediata</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPago("efectivo")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  metodoPago === "efectivo"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:bg-secondary/10"
                )}
              >
                <Banknote className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Efectivo</p>
                  <p className="text-xs text-muted-foreground">Dólares o Bolívares en salón o entrega</p>
                </div>
              </button>
            </div>

            {/* Formulario de Pago Móvil con Banco y Referencia */}
            {metodoPago === "pagomovil" ? (
              <div className="space-y-4 rounded-xl bg-secondary/5 p-5 border border-secondary/20">
                {/* Datos para realizar el Pago Móvil */}
                <div className="rounded-lg bg-card p-4 border border-border text-xs space-y-1.5">
                  <p className="font-bold text-primary text-sm flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-secondary" />
                    <span>Datos oficiales de Pago Móvil Xiorizos:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-foreground">
                    <p><strong>Banco:</strong> Banesco (0134)</p>
                    <p><strong>Teléfono:</strong> 0412 1234567</p>
                    <p><strong>Cédula / RIF:</strong> V-12.345.678</p>
                    <p><strong>Titular:</strong> Estudio Xiorizos C.A.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
                  {/* Banco emisor */}
                  <div className="space-y-1.5">
                    <Label htmlFor="banco" className="text-xs font-semibold">
                      Banco desde el que pagaste <span className="text-destructive">*</span>
                    </Label>
                    <Select value={banco} onValueChange={(val) => { setBanco(val); setBancoError(null); }}>
                      <SelectTrigger id="banco" className={bancoError ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecciona tu banco" />
                      </SelectTrigger>
                      <SelectContent>
                        {BANCOS_VENEZUELA.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bancoError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {bancoError}
                      </p>
                    )}
                  </div>

                  {/* Número de referencia */}
                  <div className="space-y-1.5">
                    <Label htmlFor="referencia" className="text-xs font-semibold">
                      Número de referencia <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="referencia"
                      required
                      maxLength={8}
                      value={referencia}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, "").slice(0, 8);
                        setReferencia(clean);
                        if (referenciaError && clean.length === 8) setReferenciaError(null);
                      }}
                      placeholder="Ej. 12345678"
                      className={referenciaError ? "border-destructive font-mono" : "font-mono"}
                    />
                    {referenciaError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {referenciaError}
                      </p>
                    )}
                  </div>

                  {/* Teléfono emisor del pago móvil (obligatorio) */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="telefonoEmisor" className="text-xs font-semibold">
                      Teléfono emisor del pago móvil <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="telefonoEmisor"
                      required
                      type="tel"
                      value={telefonoEmisor}
                      onChange={(e) => {
                        const clean = filterPhoneInput(e.target.value);
                        setTelefonoEmisor(clean);
                        if (telefonoEmisorError) setTelefonoEmisorError(null);
                      }}
                      placeholder="0412 1234567"
                      className={telefonoEmisorError ? "border-destructive font-mono" : "font-mono"}
                    />
                    {telefonoEmisorError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {telefonoEmisorError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-muted/60 p-4 border border-border text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Instrucciones de Efectivo:</p>
                <p>
                  Podrás pagar en dólares en efectivo ($) o bolívares en efectivo (Bs.) calculados a la tasa BCV oficial al momento de la entrega o al retirar personalmente en el estudio en Naguanagua.
                </p>
              </div>
            )}
          </section>

          <div className="space-y-2">
            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold py-6 rounded-xl shadow-md cursor-pointer"
              disabled={enviando}
            >
              {enviando
                ? "Registrando orden..."
                : !isAuthenticated
                ? "Iniciar sesión para pagar"
                : `Confirmar pedido por ${formatCurrency(total)}`}
            </Button>
            {metodoPago === "pagomovil" && (
              <p className="text-[11.5px] text-muted-foreground text-center leading-relaxed">
                🔔 Tu compra no se confirma automáticamente. Una vez que nuestro personal compruebe tu Pago Móvil, se te confirmará oficialmente el pedido y se te notificará por <strong>WhatsApp</strong>.
              </p>
            )}
          </div>
        </form>

        {/* Resumen lateral */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-primary">Resumen del pedido</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.variant?.id ?? "base"}`} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image src={item.product.imagenUrl} alt={item.product.nombre} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{item.product.nombre}</p>
                  {item.variant && <p className="text-xs text-muted-foreground">{item.variant.nombre}</p>}
                  <p className="text-xs text-muted-foreground">Cantidad: {item.cantidad}</p>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency((item.product.precio + (item.variant?.precioAdicional ?? 0)) * item.cantidad)}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envío</span>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold border-emerald-200">
                Gratis
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-heading text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>

          <div className="mt-4 rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground">
            🔒 Compra segura procesada directamente por el personal del salón Xiorizos.
          </div>
        </aside>
      </div>
    </div>
  );
}
