"use client";

import Image from "next/image";
import Link from "next/link";
import { OptimizedVideo } from "@/components/ui/optimized-video";
import { mockProducts } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";
import { ShoppingBag } from "lucide-react";

export function ShopSection() {
  const addItem = useCartStore((state) => state.addItem);

  // 3 curated products to accompany the video card (total 4 columns)
  const previewProducts = mockProducts.slice(0, 3);

  return (
    <section className="w-full py-space-xl bg-background" id="tienda">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Cuidado en Casa
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
              Nuestra Tienda Botánica
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-primary hover:text-secondary font-label-md text-sm font-semibold transition-colors group"
          >
            <span>Ver todo el catálogo</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 4 Cards Grid: 1 Video Card + 3 Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Card 1: Video de Productos */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-surface-container group hover:shadow-md transition-all">
            <div>
              <span className="font-label-sm text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-1">
                Línea Botánica
              </span>
              <h3 className="font-headline-sm text-base text-primary font-bold mb-2">
                Productos para tus rizos
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                Fórmulas limpias, veganas y libres de sulfatos recomendadas por nuestras especialistas.
              </p>
            </div>

            {/* Video container */}
            <div className="w-full h-[230px] rounded-lg overflow-hidden bg-black/5 relative my-auto">
              <OptimizedVideo
                src="/videos/productos_para_los_rizos.mp4"
                poster="/images/crema_de_peinar_etniker.webp"
                className="w-full h-full object-cover rounded-none"
              />
            </div>

            <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between text-xs">
              <span className="text-[11px] text-on-surface-variant font-medium">
                Sin sulfatos
              </span>
              <Link
                href="/catalogo"
                className="text-[11px] font-semibold text-primary hover:text-secondary inline-flex items-center gap-0.5"
              >
                <span>Explorar</span>
                <span className="material-symbols-outlined text-[13px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Cards 2, 3, 4: Productos sin encapsular, redondeo suave y botón visible */}
          {previewProducts.map((product) => {
            const sizeLabel = product.variantes?.[0]?.nombre || "Estándar";
            return (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container"
              >
                <div>
                  {/* Imagen abarcando toda la parte superior */}
                  <div className="w-full aspect-square overflow-hidden bg-surface-container-low relative">
                    <Image
                      src={product.imagenUrl}
                      alt={product.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 pb-2">
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                      {product.categoria}
                    </span>
                    <h4 className="font-title-md text-sm text-primary font-bold line-clamp-1 mt-0.5">
                      {product.nombre}
                    </h4>
                    <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
                      {product.descripcion}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 pt-2 flex items-center justify-between border-t border-surface-container mt-auto">
                  <div>
                    <span className="font-headline-sm text-base font-bold text-primary">
                      ${product.precio.toFixed(0)}
                    </span>
                    <span className="ml-2 font-label-sm text-[10px] text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full font-medium">
                      {sizeLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => addItem(product, product.variantes?.[0], 1)}
                    className="w-8 h-8 rounded-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                    type="button"
                    aria-label={`Añadir ${product.nombre} a la bolsa`}
                    title="Añadir al carrito"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
