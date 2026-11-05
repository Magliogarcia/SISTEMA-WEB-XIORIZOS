"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import {
  validateFullName,
  validatePhone,
  validateEmail,
  validateAddress,
  validateCardNumber,
  validateCardExpiry,
  validateCVV,
  filterPhoneInput,
  filterNameInput,
} from "@/lib/validation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [metodoPago, setMetodoPago] = useState<"tarjeta" | "transferencia">("tarjeta");
  const [enviando, setEnviando] = useState(false);

  // Form states
  const [nombre, setNombre] = useState("");
  const [nombreError, setNombreError] = useState<string | null>(null);

  const [telefono, setTelefono] = useState("");
  const [telefonoError, setTelefonoError] = useState<string | null>(null);
  const [telefonoPais, setTelefonoPais] = useState<"VE" | "CO" | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [direccion, setDireccion] = useState("");
  const [direccionError, setDireccionError] = useState<string | null>(null);

  // Payment states (for card)
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [tarjetaError, setTarjetaError] = useState<string | null>(null);

  const [vencimiento, setVencimiento] = useState("");
  const [vencimientoError, setVencimientoError] = useState<string | null>(null);

  const [cvv, setCvv] = useState("");
  const [cvvError, setCvvError] = useState<string | null>(null);

  const total = getTotal();

  function handleNombreChange(val: string) {
    const clean = filterNameInput(val);
    setNombre(clean);
    if (nombreError && validateFullName(clean).isValid) setNombreError(null);
  }

  function handleTelefonoChange(val: string) {
    const clean = filterPhoneInput(val);
    setTelefono(clean);
    if (clean.length >= 10) {
      const res = validatePhone(clean);
      if (res.isValid) {
        setTelefonoError(null);
        setTelefonoPais(res.country || null);
      }
    } else {
      setTelefonoPais(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let hasErrors = false;

    // Validar nombre
    const resNombre = validateFullName(nombre);
    if (!resNombre.isValid) {
      setNombreError(resNombre.error || "Nombre inválido");
      hasErrors = true;
    } else {
      setNombreError(null);
      setNombre(resNombre.formatted || nombre);
    }

    // Validar teléfono
    const resTel = validatePhone(telefono);
    if (!resTel.isValid) {
      setTelefonoError(resTel.error || "Teléfono inválido");
      hasErrors = true;
    } else {
      setTelefonoError(null);
      setTelefono(resTel.formatted || telefono);
      setTelefonoPais(resTel.country || null);
    }

    // Validar correo
    const resEmail = validateEmail(email);
    if (!resEmail.isValid) {
      setEmailError(resEmail.error || "Correo inválido");
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    // Validar dirección
    const resDir = validateAddress(direccion);
    if (!resDir.isValid) {
      setDireccionError(resDir.error || "Dirección inválida");
      hasErrors = true;
    } else {
      setDireccionError(null);
    }

    // Si es tarjeta, validar datos bancarios
    if (metodoPago === "tarjeta") {
      const resCard = validateCardNumber(numeroTarjeta);
      if (!resCard.isValid) {
        setTarjetaError(resCard.error || "Tarjeta inválida");
        hasErrors = true;
      } else {
        setTarjetaError(null);
      }

      const resExp = validateCardExpiry(vencimiento);
      if (!resExp.isValid) {
        setVencimientoError(resExp.error || "Fecha de expiración inválida");
        hasErrors = true;
      } else {
        setVencimientoError(null);
      }

      const resCvv = validateCVV(cvv);
      if (!resCvv.isValid) {
        setCvvError(resCvv.error || "CVV inválido");
        hasErrors = true;
      } else {
        setCvvError(null);
      }
    }

    if (hasErrors) return;

    setEnviando(true);
    setTimeout(() => {
      clearCart();
      router.push("/catalogo");
    }, 1200);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 pt-32 pb-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-muted-foreground">Agrega productos antes de continuar al pago.</p>
        <Button className="mt-6" onClick={() => router.push("/catalogo")}>
          Ir al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
                  onBlur={() => {
                    if (nombre.trim()) {
                      const r = validateFullName(nombre);
                      if (!r.isValid) setNombreError(r.error || null);
                      else setNombre(r.formatted || nombre);
                    }
                  }}
                  placeholder="Ej. Ana Pérez"
                  className={nombreError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {nombreError ? (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{nombreError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Solo letras (nombre y apellido real).</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="telefono" className="text-sm font-semibold">
                    Teléfono Celular <span className="text-destructive">*</span>
                  </Label>
                  {telefonoPais && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      {telefonoPais === "VE" ? "🇻🇪 Venezuela" : "🇨🇴 Colombia"}
                    </span>
                  )}
                </div>
                <Input
                  id="telefono"
                  required
                  type="tel"
                  value={telefono}
                  onChange={(e) => handleTelefonoChange(e.target.value)}
                  onBlur={() => {
                    if (telefono.trim()) {
                      const r = validatePhone(telefono);
                      if (!r.isValid) {
                        setTelefonoError(r.error || null);
                        setTelefonoPais(null);
                      } else {
                        setTelefono(r.formatted || telefono);
                        setTelefonoError(null);
                        setTelefonoPais(r.country || null);
                      }
                    }
                  }}
                  placeholder="0412 1234567 o 310 1234567"
                  className={telefonoError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {telefonoError ? (
                  <p className="flex items-start gap-1 text-xs text-destructive mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{telefonoError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Válido para Venezuela (0412, 0414, etc.) o Colombia (3XX). Sin letras.
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
                  onBlur={() => {
                    if (email.trim()) {
                      const r = validateEmail(email);
                      if (!r.isValid) setEmailError(r.error || null);
                    }
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
                  onBlur={() => {
                    if (direccion.trim()) {
                      const r = validateAddress(direccion);
                      if (!r.isValid) setDireccionError(r.error || null);
                    }
                  }}
                  placeholder="Av. Universidad, Res. El Trigal, Naguanagua"
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

          {/* Método de Pago */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-semibold text-primary">Método de pago</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMetodoPago("tarjeta")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  metodoPago === "tarjeta"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:bg-secondary/10"
                )}
              >
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Tarjeta de crédito / débito</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard internacional</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("transferencia")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  metodoPago === "transferencia"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:bg-secondary/10"
                )}
              >
                <Landmark className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Pago Móvil / Transferencia</p>
                  <p className="text-xs text-muted-foreground">Bancos nacionales de Venezuela</p>
                </div>
              </button>
            </div>

            {metodoPago === "tarjeta" ? (
              <div className="mt-5 space-y-4 rounded-xl bg-muted/40 p-4 border border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="numeroTarjeta" className="text-xs font-semibold">
                    Número de tarjeta <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numeroTarjeta"
                    required
                    maxLength={19}
                    value={numeroTarjeta}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                      setNumeroTarjeta(v);
                      if (tarjetaError) setTarjetaError(null);
                    }}
                    placeholder="4000 1234 5678 9010"
                    className={tarjetaError ? "border-destructive" : ""}
                  />
                  {tarjetaError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {tarjetaError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="vencimiento" className="text-xs font-semibold">
                      Vencimiento (MM/AA) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="vencimiento"
                      required
                      maxLength={5}
                      value={vencimiento}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                        setVencimiento(v);
                        if (vencimientoError) setVencimientoError(null);
                      }}
                      placeholder="12/28"
                      className={vencimientoError ? "border-destructive" : ""}
                    />
                    {vencimientoError && (
                      <p className="text-xs text-destructive">{vencimientoError}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv" className="text-xs font-semibold">
                      CVV <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cvv"
                      required
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setCvv(v);
                        if (cvvError) setCvvError(null);
                      }}
                      placeholder="123"
                      className={cvvError ? "border-destructive" : ""}
                    />
                    {cvvError && (
                      <p className="text-xs text-destructive">{cvvError}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-secondary/10 border border-secondary/20 p-4 text-xs text-foreground space-y-1.5">
                <p className="font-semibold text-secondary">Instrucciones para Pago Móvil / Transferencia:</p>
                <p>Al confirmar tu pedido recibirás por WhatsApp y correo los datos bancarios exactos (Banco Banesco / Mercantil / Pago Móvil) y la tasa oficial BCV del día para validar tu pago.</p>
              </div>
            )}
          </section>

          <Button type="submit" size="lg" className="w-full text-base font-semibold py-6" disabled={enviando}>
            {enviando ? "Procesando pedido..." : `Completar orden por ${formatCurrency(total)}`}
          </Button>
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
            🔒 Compra segura con encriptación SSL de 256 bits y garantía oficial Xiorizos.
          </div>
        </aside>
      </div>
    </div>
  );
}
