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
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/catalogo/${product.id}`}>
        <div className="relative aspect-square w-full bg-secondary">
          <Image
            src={product.imagenUrl}
            alt={product.nombre}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.stock <= 5 && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
              Últimas unidades
            </span>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-col gap-1 p-4">
        <p className="text-xs text-muted-foreground">{product.marca}</p>
        <Link href={`/catalogo/${product.id}`}>
          <p className="line-clamp-1 text-sm font-medium hover:text-primary">{product.nombre}</p>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {product.rating} ({product.reseñasCount})
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-heading font-semibold">{formatCurrency(product.precio)}</span>
          <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => addItem(product)}>
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
