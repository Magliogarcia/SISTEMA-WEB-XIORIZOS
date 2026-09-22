"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [metodoPago, setMetodoPago] = useState<"tarjeta" | "transferencia">("tarjeta");
  const [enviando, setEnviando] = useState(false);

  const total = getTotal();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      clearCart();
      router.push("/catalogo");
    }, 1200);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-muted-foreground">Agrega productos antes de continuar al pago.</p>
        <Button className="mt-6" onClick={() => router.push("/catalogo")}>
          Ir al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold">Datos de contacto y entrega</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input id="nombre" required placeholder="Ej. Ana Pérez" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" required placeholder="0412-0000000" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" required placeholder="ana@correo.com" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="direccion">Dirección de entrega</Label>
                <Input id="direccion" required placeholder="Av. Principal, Local 4" />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold">Método de pago</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMetodoPago("tarjeta")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                  metodoPago === "tarjeta" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                )}
              >
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Tarjeta de crédito/débito</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("transferencia")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                  metodoPago === "transferencia" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                )}
              >
                <Landmark className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Transferencia / Pago móvil</p>
                  <p className="text-xs text-muted-foreground">Confirmación manual</p>
                </div>
              </button>
            </div>

            {metodoPago === "tarjeta" && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="numeroTarjeta">Número de tarjeta</Label>
                  <Input id="numeroTarjeta" required placeholder="0000 0000 0000 0000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vencimiento">Vencimiento</Label>
                  <Input id="vencimiento" required placeholder="MM/AA" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" required placeholder="123" />
                </div>
              </div>
            )}
          </section>

          <Button type="submit" size="lg" className="w-full" disabled={enviando}>
            {enviando ? "Procesando pedido..." : `Pagar ${formatCurrency(total)}`}
          </Button>
        </form>

        <aside className="h-fit rounded-xl border border-border p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Resumen del pedido</h2>
          <div className="space-y-4">
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
              <Badge variant="secondary">Gratis</Badge>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-heading text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
