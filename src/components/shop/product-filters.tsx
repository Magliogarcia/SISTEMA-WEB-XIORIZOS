"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  categorias: string[];
  marcas: string[];
  categoriaSeleccionada: string | null;
  marcaSeleccionada: string | null;
  onCategoriaChange: (categoria: string | null) => void;
  onMarcaChange: (marca: string | null) => void;
}

export function ProductFilters({
  categorias,
  marcas,
  categoriaSeleccionada,
  marcaSeleccionada,
  onCategoriaChange,
  onMarcaChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">Categoría</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            onClick={() => onCategoriaChange(null)}
            variant={categoriaSeleccionada === null ? "default" : "outline"}
            className={cn("cursor-pointer", categoriaSeleccionada === null ? "" : "hover:bg-secondary")}
          >
            Todas
          </Badge>
          {categorias.map((categoria) => (
            <Badge
              key={categoria}
              onClick={() => onCategoriaChange(categoria)}
              variant={categoriaSeleccionada === categoria ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                categoriaSeleccionada === categoria ? "" : "hover:bg-secondary"
              )}
            >
              {categoria}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">Marca</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            onClick={() => onMarcaChange(null)}
            variant={marcaSeleccionada === null ? "default" : "outline"}
            className={cn("cursor-pointer", marcaSeleccionada === null ? "" : "hover:bg-secondary")}
          >
            Todas
          </Badge>
          {marcas.map((marca) => (
            <Badge
              key={marca}
              onClick={() => onMarcaChange(marca)}
              variant={marcaSeleccionada === marca ? "default" : "outline"}
              className={cn("cursor-pointer", marcaSeleccionada === marca ? "" : "hover:bg-secondary")}
            >
              {marca}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
