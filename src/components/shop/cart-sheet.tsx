"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu carrito ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
            <Button onClick={closeCart} asChild>
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.variant?.id ?? "base"}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image
                        src={item.product.imagenUrl}
                        alt={item.product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium leading-tight">{item.product.nombre}</p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">{item.variant.nombre}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.cantidad - 1, item.variant?.id)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center text-sm">{item.cantidad}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.cantidad + 1, item.variant?.id)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <span className="text-sm font-semibold">
                          {formatCurrency(
                            (item.product.precio + (item.variant?.precioAdicional ?? 0)) *
                              item.cantidad
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product.id, item.variant?.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <SheetFooter className="mt-4 flex-col gap-3 sm:flex-col">
              <div className="flex w-full items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button asChild size="lg" className="w-full" onClick={closeCart}>
                <Link href="/checkout">Proceder al pago</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
