"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockServices, type ExtendedService } from "@/lib/mock-data";

interface ServiceRowProps {
  services: ExtendedService[];
  titleBadge: string;
}

function ServiceRow({ services, titleBadge }: ServiceRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const scrollAmount = 320;
    const { scrollLeft, scrollWidth, clientWidth } = track;

    if (direction === "left") {
      if (scrollLeft <= 10) {
        // Si está al principio, vuelve al final de forma fluida
        track.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else {
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Si está al final, vuelve al inicio de forma fluida
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative w-full my-6">
      {/* Encabezado de la Fila */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="font-label-md text-xs tracking-wider uppercase font-semibold text-secondary bg-surface-container px-3 py-1 rounded-full">
          {titleBadge}
        </span>
      </div>

      {/* Contenedor del Carrusel con Botones Laterales */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botón Izquierdo */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Ver servicios anteriores"
          className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary flex items-center justify-center shadow-md border border-surface-container transition-all active:scale-90 hover:scale-105"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_left</span>
        </button>

        {/* Pista Deslizable Optimizada (Nativa, fluida, snap) */}
        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto py-2 w-full scroll-smooth scrollbar-none snap-x snap-mandatory"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="snap-start flex-shrink-0 w-[240px] sm:w-[280px] bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            >
              <div>
                {/* Imagen del Servicio */}
                <div className="w-full h-36 rounded-2xl overflow-hidden relative mb-3 bg-surface-container-low">
                  <Image
                    src={service.imagenUrl || "/images/Full_curl.webp"}
                    alt={service.nombre}
                    fill
                    sizes="(max-width: 768px) 270px, 290px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                    {service.categoria}
                  </span>
                </div>

                {/* Nombre del Servicio */}
                <h3 className="font-headline-sm text-[15px] font-bold text-primary mb-1 leading-snug line-clamp-1">
                  {service.nombre}
                </h3>

                {/* Breve Descripción */}
                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-2.5">
                  {service.descripcion}
                </p>

                {/* Enlace directo al servicio en la página /servicios */}
                <Link
                  href={`/servicios#servicio-${service.id}`}
                  className="text-xs font-semibold text-secondary hover:text-primary hover:underline inline-flex items-center gap-1 mb-2 transition-colors"
                >
                  <span>Ver más información</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>

              {/* Pie de Tarjeta: Duración y Botón Agendar */}
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

        {/* Botón Derecho */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Ver siguientes servicios"
          className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary flex items-center justify-center shadow-md border border-surface-container transition-all active:scale-90 hover:scale-105"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export function ServicesSection() {
  // 12 servicios únicos divididos limpiamente en 2 filas de 6
  const topServices = mockServices.slice(0, 6);
  const bottomServices = mockServices.slice(6, 12);

  return (
    <section className="w-full bg-surface-container-low py-space-xl" id="servicios">
      <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin">
        {/* Encabezado */}
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

        {/* Fila 1: 6 Servicios */}
        <ServiceRow
          services={topServices}
          titleBadge="Cortes, Color & Definición"
        />

        {/* Fila 2: 6 Servicios */}
        <ServiceRow
          services={bottomServices}
          titleBadge="Terapias Capilares & Uñas"
        />

        {/* Enlace al Detalle Completo */}
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
