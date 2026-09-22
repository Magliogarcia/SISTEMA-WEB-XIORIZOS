"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimulatorStore } from "@/store/simulator-store";

export function ImageDropzone() {
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setImagenOriginal = useSimulatorStore((state) => state.setImagenOriginal);

  const procesarArchivo = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setImagenOriginal(url);
    },
    [setImagenOriginal]
  );

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setArrastrando(false);
    procesarArchivo(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setArrastrando(true);
      }}
      onDragLeave={() => setArrastrando(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
        arrastrando ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        {arrastrando ? (
          <ImageIcon className="h-7 w-7 text-primary" />
        ) : (
          <UploadCloud className="h-7 w-7 text-primary" />
        )}
      </div>
      <div>
        <p className="font-medium">Arrastra tu foto aquí</p>
        <p className="text-sm text-muted-foreground">o haz clic para seleccionar un archivo (JPG, PNG)</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => procesarArchivo(e.target.files?.[0])}
      />
    </div>
  );
}
