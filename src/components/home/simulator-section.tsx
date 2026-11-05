"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface Swatch {
  name: string;
  color: string;
  afterImage: string;
}

const swatches: Swatch[] = [
  {
    name: "Castaño",
    color: "#5C3D2E",
    afterImage: "/images/persona_con_cabello_castano_normal.webp",
  },
  {
    name: "Negro",
    color: "#1A1A1A",
    afterImage: "/images/persona_con_cabello_castano_normal.webp",
  },
  {
    name: "Rojo",
    color: "#C86432",
    afterImage: "/images/persona_con_cabello_rojo_pintado.webp",
  },
];

export function SimulatorSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [sliderPosition, setSliderPosition] = useState(50);
  // Default to Rojo so the preview shows the contrast against the castaño
  const [activeSwatch, setActiveSwatch] = useState(swatches[2]);
  const [customBeforeImage, setCustomBeforeImage] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;
    const percentage = Math.round((posX / rect.width) * 100);
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login?redirect=/#simulador");
      return;
    }
    isDraggingRef.current = true;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/#simulador");
      return;
    }
    isDraggingRef.current = true;
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMove]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/#simulador");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBeforeImage(url);
    }
  };

  return (
    <section className="w-full py-space-xl bg-background" id="simulador">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        <div className="text-center max-w-xl mx-auto mb-space-lg">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
            Colorimetría Virtual
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
            Simulador de Color
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Descubre qué matiz le va mejor a tus rizos antes de aplicarte el tinte.
          </p>
        </div>

        {/* Main Interactive Frame */}
        <div className="bg-surface-container-low rounded-3xl p-space-md md:p-space-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            {/* Slider Comparison Container (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center select-none">
              <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onDragStart={(e) => e.preventDefault()}
                className="relative w-full max-w-[560px] aspect-[4/4] rounded-3xl overflow-hidden select-none shadow-[0_12px_32px_rgba(61,34,20,0.1)] cursor-ew-resize touch-none"
                style={{ userSelect: "none", WebkitUserSelect: "none" }}
              >
                {/* Right Image (Lado derecho: Cabello con Color) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                  <Image
                    src={activeSwatch.afterImage}
                    alt="Cabello rizado teñido"
                    fill
                    draggable={false}
                    className="object-cover pointer-events-none select-none"
                  />
                  {/* Color tint filter simulation overlay */}
                  <div
                    className="absolute inset-0 opacity-25 mix-blend-color pointer-events-none"
                    style={{ backgroundColor: activeSwatch.color }}
                  />
                </div>

                {/* Left Image (Lado izquierdo: Cabello Castaño Normal) */}
                <div
                  className="absolute inset-0 h-full overflow-hidden pointer-events-none select-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="relative w-[560px] max-w-none h-full pointer-events-none select-none">
                    <Image
                      src={
                        customBeforeImage ||
                        "/images/persona_con_cabello_castano_normal.webp"
                      }
                      alt="Cabello rizado natural castaño"
                      fill
                      draggable={false}
                      className="object-cover pointer-events-none select-none"
                    />
                  </div>
                </div>

                {/* Draggable Divider Line centrado perfectamente */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none -translate-x-1/2"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl border-2 border-white pointer-events-none">
                    <span className="material-symbols-outlined text-[20px] text-white">sync_alt</span>
                  </div>
                </div>

                {/* Tags limpios sin paréntesis ni textos extra */}
                <span className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-md text-on-primary font-label-sm text-label-sm px-3.5 py-1 rounded-full pointer-events-none shadow font-medium">
                  Antes
                </span>
                <span className="absolute bottom-4 right-4 bg-secondary/90 backdrop-blur-md text-on-secondary font-label-sm text-label-sm px-3.5 py-1 rounded-full pointer-events-none shadow font-medium">
                  Después
                </span>

                {/* Overlay de protección si no ha iniciado sesión */}
                {!isAuthenticated && (
                  <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white">
                      Inicia sesión para usar el simulador
                    </h3>
                    <p className="text-xs text-white/80 max-w-xs mt-1 mb-4 leading-relaxed">
                      Debes tener una cuenta activa para interactuar con la colorimetría virtual y probar tonos en tu foto.
                    </p>
                    <Link
                      href="/login?redirect=/#simulador"
                      className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-lg hover:bg-[#FAF6F0] transition-all"
                    >
                      <span>Iniciar sesión ahora</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Upload Photo Trigger */}
              <label className="mt-space-md inline-flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md px-6 py-2.5 rounded-full cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-95">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>
                  {customBeforeImage ? "Cambiar mi foto" : "Sube tu foto para probarlo en ti"}
                </span>
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {/* Color Palette Picker & Formula Metric (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-headline-sm text-headline-sm text-primary">
                    Tono Seleccionado:
                  </span>
                  <span className="font-title-md text-title-md text-secondary font-bold">
                    {activeSwatch.name}
                  </span>
                </div>

                {/* Swatches Palette List (Solo Castaño, Negro o Rojo) */}
                <div className="flex gap-4 items-center justify-start py-2">
                  {swatches.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() => setActiveSwatch(swatch)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all active:scale-95 ${
                        activeSwatch.name === swatch.name
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-105"
                          : "border-border hover:bg-secondary/10"
                      }`}
                      title={swatch.name}
                      type="button"
                    >
                      <span
                        className="w-6 h-6 rounded-full block shadow-inner border border-black/10"
                        style={{ backgroundColor: swatch.color }}
                      />
                      <span className="text-xs font-semibold text-primary">
                        {swatch.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formula Compatibility Match Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      98%
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Protección y salud de la fibra capilar
                    </p>
                  </div>
                </div>
                <div className="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-secondary" />
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/citas"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-full shadow-[0_4px_14px_rgba(18,18,18,0.22)] hover:scale-[1.02] active:scale-95 transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Pedir este color en el salón</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
