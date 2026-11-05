"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { OptimizedVideo } from "@/components/ui/optimized-video";
import { SearchBar } from "@/components/shop/search-bar";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductCard } from "@/components/shop/product-card";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mock-data";

export default function CatalogoPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [marca, setMarca] = useState<string | null>(null);
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const categorias = useMemo(
    () => Array.from(new Set(mockProducts.map((p) => p.categoria))),
    []
  );
  const marcas = useMemo(() => Array.from(new Set(mockProducts.map((p) => p.marca))), []);

  const productosFiltrados = useMemo(() => {
    return mockProducts.filter((p) => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoria || p.categoria === categoria;
      const coincideMarca = !marca || p.marca === marca;
      return coincideBusqueda && coincideCategoria && coincideMarca;
    });
  }, [busqueda, categoria, marca]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      {/* Banner de Video Productos sin recuadros grises, pegado al texto como la imagen de referencia */}
      <div className="flex justify-center w-full mb-10">
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container shadow-sm flex flex-col md:flex-row items-stretch">
          {/* Video: grande, completo, vertical y pegado al contenedor sin márgenes grises */}
          <div className="flex-shrink-0 flex items-center justify-center overflow-hidden bg-black/5">
            <OptimizedVideo
              src="/videos/productos_para_los_rizos.mp4"
              poster="/images/crema_de_peinar_etniker.webp"
              className="h-[360px] sm:h-[420px] md:h-[460px] w-auto max-w-full block"
            />
          </div>

          {/* Información y detalles pegados al video */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit">
              <span>Línea Profesional para el Hogar</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary mb-3">
              Catálogo de Productos para Rizos
            </h1>
            <p className="font-body-md text-on-surface-variant mb-5 text-sm sm:text-base leading-relaxed">
              Fórmulas ricas en mantecas vegetales, aceites puros y agentes definidores sin sulfatos ni siliconas pesadas. Ideales para mantener el rizo hidratado y definido entre visitas al salón.
            </p>
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-on-surface">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span>Marcas internacionales y nacionales aprobadas (Etniker, Skala, Cantu)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span>Fórmulas limpias aptas para el Método Curly Girl</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span>Disponibles en el salón y con envíos a toda Venezuela</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 && "s"} disponible{productosFiltrados.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="w-64">
            <SearchBar value={busqueda} onChange={setBusqueda} />
          </div>

          <Sheet open={filtrosOpen} onOpenChange={setFiltrosOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden rounded-full">
                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductFilters
                  categorias={categorias}
                  marcas={marcas}
                  categoriaSeleccionada={categoria}
                  marcaSeleccionada={marca}
                  onCategoriaChange={setCategoria}
                  onMarcaChange={setMarca}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters
            categorias={categorias}
            marcas={marcas}
            categoriaSeleccionada={categoria}
            marcaSeleccionada={marca}
            onCategoriaChange={setCategoria}
            onMarcaChange={setMarca}
          />
        </aside>

        <div>
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-container py-20 text-center bg-surface-container-low">
              <p className="text-sm text-on-surface-variant">
                No encontramos productos con esos filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {productosFiltrados.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
