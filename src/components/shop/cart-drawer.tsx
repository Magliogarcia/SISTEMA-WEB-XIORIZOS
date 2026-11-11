"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-surface-container-lowest shadow-[0_24px_48px_-8px_rgba(18,18,18,0.25)] flex flex-col justify-between p-space-md overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-primary">shopping_bag</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Tu Bolsa</h3>
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
              type="button"
              aria-label="Cerrar bolsa"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* 3-Step visual checkout progress indicator */}
          <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-full mb-space-md text-center">
            <span className="font-label-sm text-label-sm font-bold text-on-primary bg-primary px-3 py-1 rounded-full">
              1. Carrito
            </span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_forward</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant px-2 py-1">
              2. Datos
            </span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_forward</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant px-2 py-1">
              3. Pago
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex flex-col gap-space-sm">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                  shopping_bag
                </span>
                <p className="font-body-md text-on-surface-variant">Tu bolsa está vacía</p>
                <p className="font-body-sm text-outline mt-1">Descubre nuestros productos para rizos y ondas</p>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = item.product.precio + (item.variant?.precioAdicional ?? 0);
                return (
                  <div
                    key={`${item.product.id}-${item.variant?.id ?? "base"}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container-lowest flex-shrink-0">
                      <Image
                        src={item.product.imagenUrl}
                        alt={item.product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-title-md text-[14px] font-bold text-primary truncate">
                        {item.product.nombre}
                      </p>
                      <p className="font-label-sm text-label-sm text-secondary font-semibold">
                        ${(itemPrice * item.cantidad).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls (+ / -) con límite de stock estricto */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2 py-1 rounded-full border border-surface-container">
                        <button
                          onClick={() => {
                            if (item.cantidad > 1) {
                              updateQuantity(item.product.id, item.cantidad - 1, item.variant?.id);
                            } else {
                              removeItem(item.product.id, item.variant?.id);
                            }
                          }}
                          className="w-6 h-6 rounded-full hover:bg-surface-container-high flex items-center justify-center text-primary text-sm font-bold transition-colors cursor-pointer"
                          aria-label="Restar una unidad"
                          type="button"
                        >
                          -
                        </button>
                        <span className="font-label-md text-[13px] font-bold px-1 min-w-[16px] text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => {
                            const maxStock = item.variant?.stock ?? item.product.stock ?? 999;
                            if (item.cantidad < maxStock) {
                              updateQuantity(item.product.id, item.cantidad + 1, item.variant?.id);
                            }
                          }}
                          disabled={item.cantidad >= (item.variant?.stock ?? item.product.stock ?? 999)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-primary text-sm font-bold transition-colors ${
                            item.cantidad >= (item.variant?.stock ?? item.product.stock ?? 999)
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-surface-container-high cursor-pointer"
                          }`}
                          aria-label="Sumar una unidad"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      {item.cantidad >= (item.variant?.stock ?? item.product.stock ?? 999) && (
                        <span className="text-[10px] text-amber-700 font-semibold">
                          Máx: {item.product.stock}
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.product.id, item.variant?.id)}
                      className="w-7 h-7 rounded-full text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                      aria-label="Eliminar producto"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cart Bottom & Checkout */}
        <div className="pt-space-md border-t border-surface-container">
          <div className="flex items-center justify-between pb-3">
            <span className="font-title-md text-title-md text-on-surface-variant">Total</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              ${total.toFixed(2)}
            </span>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/584127434761?text=${encodeURIComponent(
                  `¡Hola Xiorizos! Quiero pedir los siguientes productos:\n${items
                    .map(
                      (i) =>
                        `• ${i.product.nombre} x${i.cantidad} ($${(
                          (i.product.precio + (i.variant?.precioAdicional ?? 0)) *
                          i.cantidad
                        ).toFixed(2)})`
                    )
                    .join("\n")}\nTotal: $${total.toFixed(2)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-secondary hover:bg-secondary/90 text-on-secondary font-label-lg text-label-lg py-3 rounded-full shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Pedir por WhatsApp
              </a>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full text-center bg-primary text-on-primary font-label-lg text-label-lg py-3 rounded-full shadow-md hover:bg-tertiary-container transition-colors"
              >
                Continuar con la compra
              </Link>
            </div>
          ) : (
            <button
              onClick={closeCart}
              className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-3.5 rounded-full shadow-md hover:bg-tertiary-container transition-colors"
            >
              Ver productos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
