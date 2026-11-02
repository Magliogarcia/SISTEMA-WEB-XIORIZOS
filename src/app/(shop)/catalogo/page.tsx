"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
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
      {/* Banner de Video Productos sin recortar */}
      <div className="mb-10 bg-surface-container-low rounded-xl p-5 sm:p-7 border border-surface-container shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-wider font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              Línea Profesional para el Hogar
            </span>
            <h1 className="font-headline-lg text-2xl sm:text-4xl font-bold text-primary mt-3">
              Catálogo de Productos para Rizos
            </h1>
            <p className="mt-2 text-sm sm:text-base text-on-surface-variant max-w-xl">
              Fórmulas ricas en mantecas vegetales, aceites puros y agentes definidores sin sulfatos ni siliconas pesadas. Ideales para mantener el rizo hidratado y definido entre visitas al salón.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-center justify-center bg-black/5 rounded-xl overflow-hidden p-2">
            <video
              src="/videos/productos_para_los_rizos.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              disablePictureInPicture
              className="w-full h-auto max-h-[280px] object-contain rounded-2xl"
            />
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
