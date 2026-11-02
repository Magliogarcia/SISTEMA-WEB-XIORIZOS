"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockServices, type ExtendedService } from "@/lib/mock-data";

interface ServiceRowProps {
  services: ExtendedService[];
  direction: "right" | "left";
  titleBadge: string;
}

function ServiceRow({ services, direction, titleBadge }: ServiceRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Duplicate items 6 times to create a virtually infinite continuous loop
  const loopCount = 6;
  const loopedItems = Array.from({ length: loopCount }, () => services).flat();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Check if device is mobile - on mobile do NOT run auto-animation
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return;
    }

    // Set initial position in the middle segment
    const singleSegmentWidth = track.scrollWidth / loopCount;
    track.scrollLeft = singleSegmentWidth * 2;

    let animationFrameId: number;
    const speed = 0.7; // constant subtle glide

    const step = () => {
      if (track && !isHoveredRef.current) {
        const segWidth = track.scrollWidth / loopCount;

        if (direction === "right") {
          track.scrollLeft += speed;
          // When passing the 4th segment, seamlessly jump back by 1 segment without visual change
          if (track.scrollLeft >= segWidth * 4) {
            track.scrollLeft -= segWidth;
          }
        } else {
          track.scrollLeft -= speed;
          // When passing the 1st segment backwards, seamlessly jump forward by 1 segment
          if (track.scrollLeft <= segWidth) {
            track.scrollLeft += segWidth;
          }
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [direction, loopCount]);

  // Clicking side arrow buttons moves track smoothly WITHOUT stopping auto-play
  const handleNavClick = useCallback((offset: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full my-5">
      {/* Row Header Indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="font-label-md text-xs tracking-wider uppercase font-semibold text-secondary bg-surface-container px-3 py-1 rounded-full">
          {titleBadge}
        </span>
      </div>

      {/* Row Container with Flanking Buttons */}
      <div className="flex items-center gap-2">
        {/* Left Side Button */}
        <button
          type="button"
          onClick={() => handleNavClick(-320)}
          aria-label="Desplazar a la izquierda"
          className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary flex items-center justify-center shadow-md border border-surface-container transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        {/* Scrollable Track */}
        <div
          ref={trackRef}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          className="flex gap-4 overflow-x-auto md:overflow-x-hidden py-2 select-none w-full scroll-smooth scrollbar-none"
        >
          {loopedItems.map((service, idx) => (
            <div
              key={`${service.id}-${idx}`}
              className="flex-shrink-0 w-[275px] sm:w-[295px] bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            >
              <div>
                {/* Compact Service Image */}
                <div className="w-full h-36 rounded-2xl overflow-hidden relative mb-3 bg-surface-container-low">
                  <Image
                    src={service.imagenUrl || "/images/Full_curl.webp"}
                    alt={service.nombre}
                    fill
                    sizes="(max-width: 768px) 275px, 295px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                    {service.categoria}
                  </span>
                </div>

                {/* Service Name */}
                <h3 className="font-headline-sm text-[15px] font-bold text-primary mb-1 leading-snug line-clamp-1">
                  {service.nombre}
                </h3>

                {/* Brief description */}
                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-2.5">
                  {service.descripcion}
                </p>

                {/* Link to Service Details on /servicios page */}
                <Link
                  href={`/servicios#servicio-${service.id}`}
                  className="text-xs font-semibold text-secondary hover:text-primary hover:underline inline-flex items-center gap-1 mb-2 transition-colors"
                >
                  <span>Ver más información</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card Footer: Duración & Agendar Button */}
              <div className="pt-2.5 border-t border-surface-container flex items-center justify-between mt-auto">
                <span className="font-label-md text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  {service.duracionMin} min
                </span>
                <Link
                  href={`/citas?servicio=${service.id}`}
                  className="bg-primary text-on-primary font-label-md text-xs px-4 py-1.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Agendar
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side Button */}
        <button
          type="button"
          onClick={() => handleNavClick(320)}
          aria-label="Desplazar a la derecha"
          className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary flex items-center justify-center shadow-md border border-surface-container transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export function ServicesSection() {
  // 12 unique services: exactly 6 in row 1, 6 in row 2
  const topServices = mockServices.slice(0, 6);
  const bottomServices = mockServices.slice(6, 12);

  return (
    <section className="w-full bg-surface-container-low py-space-xl" id="servicios">
      <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-space-lg">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
            Carta de Especialidades
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
            Nuestros Servicios
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Protocolos diseñados exclusivamente para la anatomía y salud del cabello ondulado, rizado y afro.
          </p>
        </div>

        {/* Fila 1: 6 Servicios - Movimiento infinito hacia la derecha en desktop */}
        <ServiceRow
          services={topServices}
          direction="right"
          titleBadge="Cortes, Color & Definición"
        />

        {/* Fila 2: 6 Servicios - Movimiento infinito hacia la izquierda en desktop */}
        <ServiceRow
          services={bottomServices}
          direction="left"
          titleBadge="Terapias Capilares & Uñas"
        />

        {/* View All Services Link */}
        <div className="text-center mt-6">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-sm px-6 py-2.5 rounded-full shadow-md hover:scale-105 transition-all"
          >
            <span>Ver detalle completo de los 12 servicios</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
