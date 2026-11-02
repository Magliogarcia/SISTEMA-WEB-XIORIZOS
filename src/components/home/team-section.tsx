"use client";

import Image from "next/image";
import Link from "next/link";
import { realStaffMembers } from "@/lib/mock-data";

export function TeamSection() {
  // Show ONLY the specialists on homepage
  const specialists = realStaffMembers.filter((m) =>
    ["st1", "st4", "st5", "st6"].includes(m.id)
  );

  return (
    <section className="w-full py-space-xl bg-surface-container-low" id="equipo">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin text-center">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
          Profesionales Certificadas
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
          Nuestras Especialistas
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 mb-space-lg max-w-xl mx-auto">
          Especialistas con vocación dedicadas exclusivamente a la salud, curvatura y belleza de tu cabello y uñas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center bg-surface-container-lowest p-6 rounded-3xl shadow-sm group hover:shadow-md transition-all border border-surface-container text-center"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden bg-surface-container mb-4 group-hover:scale-105 transition-transform duration-300 relative shadow-md">
                <Image
                  src={member.imagenUrl}
                  alt={member.nombre}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-primary">
                {member.nombre}
              </h3>
              <span className="font-label-sm text-xs text-secondary bg-secondary/10 px-3 py-1 rounded-full mt-1.5 font-medium">
                {member.cargo}
              </span>
              <p className="text-xs text-on-surface-variant mt-3 line-clamp-3 leading-relaxed">
                {member.descripcion}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/nosotros"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-label-md text-sm font-semibold transition-colors group"
          >
            <span>Conoce a todo el equipo en Sobre Nosotros</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
