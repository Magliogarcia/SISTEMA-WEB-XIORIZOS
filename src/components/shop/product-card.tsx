"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="group h-full overflow-hidden rounded-md border border-surface-container bg-surface-container-lowest transition-all hover:shadow-md hover:border-primary/20 flex flex-col justify-between">
      <div>
        <Link href={`/catalogo/${product.id}`} className="block">
          {/* Imagen ocupando toda la parte superior de extremo a extremo, con esquinas sutilmente redondeadas */}
          <div className="relative aspect-square w-full bg-surface-container-low overflow-hidden rounded-t-md">
            <Image
              src={product.imagenUrl}
              alt={product.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.stock <= 5 && (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-destructive/90 px-2.5 py-0.5 text-[10px] font-semibold text-destructive-foreground shadow-sm">
                Últimas unidades
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
        {/* Botón de compra con color destacado y visible */}
        <button
          type="button"
          className="h-9 w-9 rounded-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          onClick={() => addItem(product)}
          aria-label={`Añadir ${product.nombre} al carrito`}
          title="Añadir al carrito"
        >
          <ShoppingBag className="h-4 w-4 text-white" />
        </button>
      </div>
    </Card>
  );
}
