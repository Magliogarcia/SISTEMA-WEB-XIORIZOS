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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Catálogo</h1>
          <p className="text-sm text-muted-foreground">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 && "s"} encontrado
            {productosFiltrados.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="w-64">
            <SearchBar value={busqueda} onChange={setBusqueda} />
          </div>

          <Sheet open={filtrosOpen} onOpenChange={setFiltrosOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
              <p className="text-sm text-muted-foreground">
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
