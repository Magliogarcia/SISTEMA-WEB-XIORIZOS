"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Minus, Plus, ShoppingBag, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

const mockReseñas = [
  { id: "r1", autor: "María G.", calificacion: 5, comentario: "Excelente producto, cubrió muy bien las canas y quedó un color parejo." },
  { id: "r2", autor: "Luis R.", calificacion: 4, comentario: "Buena calidad, el olor es fuerte pero el resultado vale la pena." },
];

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<Product | null>(
    mockProducts.find((p) => p.id === params.productId) || null
  );
  const [cargando, setCargando] = useState(true);

  const { addItem, items } = useCartStore();

  const [varianteId, setVarianteId] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [feedbackStock, setFeedbackStock] = useState<string | null>(null);

  // Sincronizar con el stock en tiempo real desde la base de datos
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.productos)) {
          const liveProduct = data.productos.find((p: any) => p.id === params.productId);
          if (liveProduct) {
            setProduct(liveProduct);
            if (liveProduct.variantes && liveProduct.variantes.length > 0) {
              setVarianteId(liveProduct.variantes[0].id);
            }
          }
        }
      })
      .catch((err) => console.error("Error al cargar producto:", err))
      .finally(() => setCargando(false));
  }, [params.productId]);

  if (!product && !cargando) return notFound();
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 text-center text-xs text-slate-500">
        Cargando detalles del producto...
      </div>
    );
  }

  const stockActual = product.stock ?? 0;
  const estaAgotado = stockActual <= 0;

  const itemEnCarrito = items.find((i) => i.product.id === product.id);
  const enBolsa = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  const disponibleParaAgregar = Math.max(0, stockActual - enBolsa);

  const variante = product.variantes?.find((v) => v.id === varianteId);
  const precioFinal = product.precio + (variante?.precioAdicional ?? 0);

  function handleAgregar() {
    if (!product || estaAgotado) return;
    if (disponibleParaAgregar <= 0) {
      setFeedbackStock(`Ya tienes el stock total disponible (${stockActual} unidades) en tu bolsa.`);
      return;
    }
    const aAgregar = Math.min(cantidad, disponibleParaAgregar);
    const exito = addItem(product, variante, aAgregar);
    if (!exito) {
      setFeedbackStock(`No hay más unidades disponibles de este producto.`);
    } else {
      setFeedbackStock(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 font-sans">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Contenedor de la Imagen con Capa Overlay Horizontal de AGOTADO */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-secondary border border-surface-container shadow-xs">
          <Image
            src={product.imagenUrl}
            alt={product.nombre}
            fill
            unoptimized={true}
            className={`object-cover ${estaAgotado ? "grayscale opacity-75" : ""}`}
          />

          {/* Capa Horizontal de AGOTADO con letra gruesa destacada */}
          {estaAgotado && (
            <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center p-0">
              <div className="w-full bg-rose-600/95 py-3 px-6 text-center shadow-2xl border-y-2 border-rose-400">
                <span className="font-black text-white text-lg sm:text-2xl tracking-[0.3em] uppercase drop-shadow-md select-none">
                  AGOTADO
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-secondary">{product.marca}</p>
          <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-primary">{product.nombre}</h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.round(product.rating || 5) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating || 5} ({product.reseñasCount || 1} reseñas)
            </span>
          </div>

          <p className="mt-4 text-3xl font-heading font-bold text-primary">
            {formatCurrency(precioFinal)}
          </p>

          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-on-surface-variant">
            {product.descripcion}
          </p>

          <Separator className="my-6" />

          {/* Stock y Disponibilidad */}
          <div className="mb-4">
            {estaAgotado ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                <Ban className="h-4 w-4" />
                <span>Producto agotado temporalmente en inventario</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>En stock ({stockActual} unidades disponibles)</span>
                </span>
                {enBolsa > 0 && (
                  <span className="text-slate-500 font-medium">
                    ({enBolsa} en tu bolsa)
                  </span>
                )}
              </div>
            )}
          </div>

          {product.variantes && product.variantes.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2.5 text-xs font-semibold text-slate-700">Variante</h3>
              <div className="flex flex-wrap gap-2">
                {product.variantes.map((v) => (
                  <Badge
                    key={v.id}
                    onClick={() => setVarianteId(v.id)}
                    variant={varianteId === v.id ? "default" : "outline"}
                    className={cn("cursor-pointer px-3 py-1.5 rounded-sm text-xs", varianteId === v.id ? "" : "hover:bg-secondary")}
                  >
                    {v.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Cantidad limitado al stock real */}
          {!estaAgotado && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">Cantidad</span>
                <div className="flex items-center gap-2 rounded-sm border border-slate-200 px-2 py-1 bg-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-sm text-slate-700 hover:bg-slate-100"
                    disabled={cantidad <= 1}
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">{cantidad}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-sm text-slate-700 hover:bg-slate-100"
                    disabled={cantidad >= disponibleParaAgregar}
                    onClick={() => setCantidad((c) => Math.min(disponibleParaAgregar, c + 1))}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-[11px] text-slate-500">
                  {disponibleParaAgregar > 0
                    ? `Puedes agregar hasta ${disponibleParaAgregar} más`
                    : "Límite de stock alcanzado en bolsa"}
                </span>
              </div>

              {feedbackStock && (
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-sm border border-amber-200">
                  {feedbackStock}
                </p>
              )}
            </div>
          )}

          {/* Botón de Agregar a la Bolsa / Agotado */}
          <div className="flex gap-4">
            <Button
              size="lg"
              disabled={estaAgotado || disponibleParaAgregar <= 0}
              onClick={handleAgregar}
              className={`flex-1 gap-2 font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all ${
                estaAgotado || disponibleParaAgregar <= 0
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-200"
                  : "bg-primary hover:bg-secondary text-white cursor-pointer active:scale-95"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {estaAgotado
                ? "Producto Agotado"
                : disponibleParaAgregar <= 0
                ? "Stock Máximo en Bolsa"
                : `Añadir a la bolsa (${cantidad})`}
            </Button>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="font-heading text-lg font-bold text-primary">Opiniones de clientes</h2>
            <div className="mt-4 space-y-3">
              {mockReseñas.map((r) => (
                <div key={r.id} className="rounded-sm border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">{r.autor}</span>
                    <div className="flex">
                      {Array.from({ length: r.calificacion }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{r.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
