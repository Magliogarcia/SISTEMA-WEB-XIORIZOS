"use client";

import Image from "next/image";
import Link from "next/link";
import { OptimizedVideo } from "@/components/ui/optimized-video";
import { useCartStore } from "@/store/cart-store";
import { mockProducts } from "@/lib/mock-data";

export function ShopSection() {
  const { addItem, openCart, getItemsCount } = useCartStore();
  const cartCount = getItemsCount();
  // 3 curated products to accompany the video card (total 4 columns)
  const previewProducts = mockProducts.slice(0, 3);

  return (
    <section className="w-full py-space-xl bg-surface-container-low" id="tienda">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-8">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Tienda & Productos
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
              Fórmulas Botánicas para tus Rizos
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Las mismas líneas profesionales que aplicamos en nuestro salón, disponibles para tu rutina en casa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="inline-flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-xs sm:text-sm px-4 py-2 rounded-full shadow-sm transition-all active:scale-95 font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Bolsa ({cartCount})</span>
            </button>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-xs sm:text-sm px-5 py-2 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>Ver catálogo</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* 4 Cards Grid: 1 Video Card + 3 Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          
          {/* Card 1: Video de Productos (Sin etiqueta 'Líneas aprobadas', video más alto y sin borde redondeado) */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-primary mb-2 line-clamp-1">
                Productos para tus rizos
              </h3>
            </div>

            {/* Video container: rounded-none y con mayor altura dentro del contenedor */}
            <div className="w-full aspect-[4/4.8] rounded-none overflow-hidden bg-black/5 relative my-1 flex items-center justify-center">
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

          {/* Cards 2, 3, 4: Productos con imágenes con 2px de borde redondeado (rounded-[2px]) */}
          {previewProducts.map((product) => {
            const sizeLabel = product.variantes?.[0]?.nombre || "Estándar";
            return (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-surface-container"
              >
                {/* Imagen del producto con exactamente 2px de redondeo */}
                <div className="w-full aspect-square rounded-[2px] overflow-hidden bg-surface-container-low mb-2.5 relative">
                  <Image
                    src={product.imagenUrl}
                    alt={product.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-[2px]"
                  />
                  <button
                    onClick={() => addItem(product, product.variantes?.[0], 1)}
                    className="add-to-cart-btn absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary hover:bg-secondary text-on-primary flex items-center justify-center shadow-md active:scale-90 transition-all"
                    type="button"
                    aria-label={`Añadir ${product.nombre} a la bolsa`}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
                <div>
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
                <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-surface-container">
                  <span className="font-headline-sm text-sm font-bold text-primary">
                    ${product.precio.toFixed(0)}
                  </span>
                  <span className="font-label-sm text-[10px] text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full font-medium">
                    {sizeLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
