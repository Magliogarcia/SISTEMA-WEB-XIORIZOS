"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="group h-full overflow-hidden rounded-xl border border-surface-container bg-surface-container-lowest transition-all hover:shadow-md hover:border-primary/20">
      <Link href={`/catalogo/${product.id}`}>
        {/* Contenedor de la imagen del producto con exactamente 2px de borde redondeado */}
        <div className="relative aspect-square w-full bg-surface-container-low overflow-hidden rounded-[2px] m-1 sm:m-1.5" style={{ width: "calc(100% - 8px)" }}>
          <Image
            src={product.imagenUrl}
            alt={product.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-[2px]"
          />
          {product.stock <= 5 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-destructive/90 px-2.5 py-0.5 text-[10px] font-semibold text-destructive-foreground shadow-sm">
              Últimas unidades
            </span>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-col gap-1 p-3.5 sm:p-4">
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
        <div className="mt-2 pt-2 border-t border-surface-container flex items-center justify-between">
          <span className="font-headline-sm font-bold text-sm sm:text-base text-primary">
            {formatCurrency(product.precio)}
          </span>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-lg bg-surface-container-low hover:bg-primary hover:text-white transition-colors"
            onClick={() => addItem(product)}
            aria-label={`Añadir ${product.nombre} al carrito`}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
