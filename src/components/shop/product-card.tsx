"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCartStore();

  const itemEnCarrito = items.find((i) => i.product.id === product.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  const estaAgotado = product.stock <= 0;
  const limiteAlcanzado = cantidadEnCarrito >= product.stock;

  return (
    <Card className="group h-full overflow-hidden rounded-md border border-surface-container bg-surface-container-lowest transition-all hover:shadow-md hover:border-primary/20 flex flex-col justify-between relative">
      <div>
        <Link href={`/catalogo/${product.id}`} className="block relative">
          {/* Imagen del producto */}
          <div className="relative aspect-square w-full bg-surface-container-low overflow-hidden rounded-t-md">
            <Image
              src={product.imagenUrl}
              alt={product.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={true}
              className={`object-cover transition-transform duration-500 ${
                estaAgotado ? "grayscale opacity-75" : "group-hover:scale-105"
              }`}
            />

            {/* Capa Overlay Horizontal de AGOTADO con letra gruesa si el stock llega a 0 */}
            {estaAgotado && (
              <div className="absolute inset-0 z-20 bg-slate-950/65 backdrop-blur-[1px] flex items-center justify-center p-0">
                <div className="w-full bg-rose-600/95 py-2.5 px-4 text-center shadow-2xl border-y-2 border-rose-400">
                  <span className="font-black text-white text-sm sm:text-base tracking-[0.25em] uppercase drop-shadow-md select-none">
                    AGOTADO
                  </span>
                </div>
              </div>
            )}

            {/* Etiqueta de últimas unidades si no está agotado */}
            {!estaAgotado && product.stock <= 5 && (
              <span className="absolute left-2.5 top-2.5 z-10 rounded-sm bg-rose-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-wide">
                Últimas {product.stock} unid.
              </span>
            )}
          </div>
        </Link>

        <CardContent className="flex flex-col gap-1 p-3.5 sm:p-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            {product.categoria || product.marca}
          </p>
          <Link href={`/catalogo/${product.id}`}>
            <p className="line-clamp-1 text-sm font-bold text-primary hover:text-secondary transition-colors">
              {product.nombre}
            </p>
          </Link>
          <p className="line-clamp-2 text-xs text-on-surface-variant leading-relaxed">
            {product.descripcion}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-on-surface-variant">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-[11px] text-on-surface-variant/70">({product.reseñasCount})</span>
          </div>
        </CardContent>
      </div>

      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2 border-t border-surface-container flex items-center justify-between mt-auto">
        <span className="font-headline-sm font-bold text-sm sm:text-base text-primary">
          {formatCurrency(product.precio)}
        </span>

        {/* Acciones de compra vinculadas estrictamente al stock del panel admin */}
        {estaAgotado ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 uppercase tracking-wider">
            <Ban className="h-3 w-3" />
            <span>Agotado</span>
          </span>
        ) : (
          <button
            type="button"
            disabled={limiteAlcanzado}
            onClick={() => addItem(product)}
            className={`h-9 px-3.5 rounded-full flex items-center gap-1.5 transition-all text-xs font-bold ${
              limiteAlcanzado
                ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                : "bg-primary hover:bg-secondary text-white shadow-md active:scale-95 cursor-pointer"
            }`}
            aria-label={`Añadir ${product.nombre} al carrito`}
            title={
              limiteAlcanzado
                ? `Has alcanzado el límite máximo de stock (${product.stock} disponibles)`
                : `Añadir al carrito (${product.stock} disponibles)`
            }
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>
              {limiteAlcanzado ? "Máximo en bolsa" : cantidadEnCarrito > 0 ? `(${cantidadEnCarrito}) Añadir` : "Agregar"}
            </span>
          </button>
        )}
      </div>
    </Card>
  );
}
