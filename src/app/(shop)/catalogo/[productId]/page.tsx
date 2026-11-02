"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";

const mockReseñas = [
  { id: "r1", autor: "María G.", calificacion: 5, comentario: "Excelente producto, cubrió muy bien las canas y quedó un color parejo." },
  { id: "r2", autor: "Luis R.", calificacion: 4, comentario: "Buena calidad, el olor es fuerte pero el resultado vale la pena." },
];

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = mockProducts.find((p) => p.id === params.productId);
  const addItem = useCartStore((state) => state.addItem);

  const [varianteId, setVarianteId] = useState(product?.variantes[0]?.id ?? null);
  const [cantidad, setCantidad] = useState(1);

  if (!product) return notFound();

  const variante = product.variantes.find((v) => v.id === varianteId);
  const precioFinal = product.precio + (variante?.precioAdicional ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
          <Image src={product.imagenUrl} alt={product.nombre} fill className="object-cover" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{product.marca}</p>
          <h1 className="mt-1 font-heading text-3xl font-bold">{product.nombre}</h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reseñasCount} reseñas)
            </span>
          </div>

          <p className="mt-4 text-3xl font-heading font-bold text-primary">
            {formatCurrency(precioFinal)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.descripcion}
          </p>

          <Separator className="my-6" />

          {product.variantes.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold">Variante</h3>
              <div className="flex flex-wrap gap-2">
                {product.variantes.map((v) => (
                  <Badge
                    key={v.id}
                    onClick={() => setVarianteId(v.id)}
                    variant={varianteId === v.id ? "default" : "outline"}
                    className={cn("cursor-pointer px-3 py-1.5", varianteId === v.id ? "" : "hover:bg-secondary")}
                  >
                    {v.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-semibold">Cantidad</span>
            <div className="flex items-center gap-3 rounded-lg border border-border px-2 py-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm">{cantidad}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCantidad((c) => c + 1)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} disponibles</span>
          </div>

          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => addItem(product, variante, cantidad)}
          >
            <ShoppingBag className="h-4 w-4" />
            Agregar al carrito
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 font-heading text-2xl font-bold">Reseñas de clientes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockReseñas.map((reseña) => (
            <div key={reseña.id} className="rounded-xl border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{reseña.autor}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < reseña.calificacion ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{reseña.comentario}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
