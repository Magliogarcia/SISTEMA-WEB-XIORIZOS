"use client";

import Image from "next/image";
import Link from "next/link";
import { OptimizedVideo } from "@/components/ui/optimized-video";

export function AboutSection() {
  return (
    <section className="w-full py-space-xl bg-surface-container-lowest" id="sobre-nosotros">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        {/* Section Header */}
        <div className="max-w-3xl mb-space-lg">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
            Nuestra Historia & Pasión
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
            Un espacio creado para amar y entender tus rizos
          </h2>
          <p className="font-body-md text-body-lg text-on-surface-variant mt-3 leading-relaxed">
            Somos el salón y estudio de referencia en Valencia, especializados exclusivamente en cabello ondulado, rizado y afro. Aquí no hay alisados ni procesos agresivos: tratamos cada hebra con ciencia, respeto y orgullo de nuestras raíces.
          </p>
        </div>

        {/* Unified Container: Video on Left (flush, no horizontal empty margins) + Text on Right */}
        <div className="flex justify-center w-full mb-space-lg">
          <div className="max-w-fit mx-auto rounded-3xl overflow-hidden bg-surface-container-low border border-surface-container shadow-sm flex flex-col md:flex-row items-stretch">
            {/* Left Column: Video flush without empty horizontal margins */}
            <div className="flex-shrink-0 flex items-center justify-center bg-black/5 overflow-hidden">
              <OptimizedVideo
                src="/videos/video_recorrido_por_negocio.mp4"
                poster="/images/Personal2.webp"
                className="h-[360px] sm:h-[440px] md:h-[480px] w-auto max-w-full block"
              />
            </div>

            {/* Right Column: Information & Details */}
            <div className="w-full md:w-[400px] lg:w-[460px] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit">
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>Recorrido por nuestro estudio</span>
              </div>
              <h3 className="font-headline-md text-2xl sm:text-3xl text-primary font-bold mb-3 leading-snug">
                Siéntete en casa desde que cruzas la puerta
              </h3>
              <p className="font-body-md text-on-surface-variant mb-5 text-sm sm:text-base leading-relaxed">
                Ubicados en la Torre Anexa del Centro Científico Metropolitano del Norte en Naguanagua. Diseñamos cada rincón pensando en tu comodidad: estaciones de lavado ergonómicas, difusores profesionales, capilógrafo digital de alta definición y el mejor ambiente de confianza.
              </p>
              <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-on-surface">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Diagnóstico digital con capilógrafo antes de cada servicio</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Especialistas certificados en curvaturas 2A a 4C</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Ambiente cálido, sin prisas y 100% personalizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Galería del Personal (Personal1, Personal2, Personal3) */}
        <div className="mb-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-semibold">
                Nuestra Familia
              </span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                El equipo detrás de tu transformación
              </h3>
            </div>
            <Link
              href="/nosotros"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-primary hover:text-secondary font-label-md text-sm font-semibold transition-colors group"
            >
              <span>Conoce a cada integrante</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group rounded-3xl overflow-hidden bg-surface-container-low aspect-[4/3] border border-surface-container shadow-sm">
              <Image
                src="/images/Personal1.webp"
                alt="Equipo Xiorizos trabajando en el salón"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <span className="text-white font-title-sm text-sm font-medium">
                  Atención cálida y cercana
                </span>
              </div>
            </div>

            <div className="relative group rounded-3xl overflow-hidden bg-surface-container-low aspect-[4/3] border border-surface-container shadow-sm">
              <Image
                src="/images/Personal2.webp"
                alt="Especialistas de Xiorizos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <span className="text-white font-title-sm text-sm font-medium">
                  Técnicas avanzadas en rizos
                </span>
              </div>
            </div>

            <div className="relative group rounded-3xl overflow-hidden bg-surface-container-low aspect-[4/3] border border-surface-container shadow-sm">
              <Image
                src="/images/personal3.webp"
                alt="Personal y fundadora de Xiorizos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <span className="text-white font-title-sm text-sm font-medium">
                  Pasión y dedicación diaria
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comunidad Xiorizos: Banner con varios_clientes_de_frente_posando_para_foto.webp */}
        <div className="relative rounded-3xl overflow-hidden bg-primary text-on-primary p-6 sm:p-10 shadow-lg border border-black/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <span className="inline-block bg-white/20 text-white font-label-sm text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Comunidad Xiorizos
              </span>
              <h3 className="font-headline-md text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                Más de 2.000 personas han aprendido a amar su textura natural con nosotros
              </h3>
              <p className="text-on-primary/85 text-sm leading-relaxed mb-6">
                Desde niñas y jóvenes en transición capilar hasta caballeros y adultos. En Xiorizos celebramos la diversidad de patrones ondulados, rizados y afros sin tabúes ni juicios.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/citas"
                  className="bg-surface-container-lowest text-primary font-label-md text-sm px-6 py-3 rounded-full shadow hover:scale-105 active:scale-95 transition-all"
                >
                  Unirme a la experiencia
                </Link>
                <Link
                  href="/nosotros"
                  className="inline-flex items-center gap-2 text-white border border-white/30 hover:bg-white/10 font-label-md text-sm px-6 py-3 rounded-full transition-all"
                >
                  <span>Conocer más</span>
                  <span className="material-symbols-outlined text-[16px]">east</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative w-full h-[260px] sm:h-[340px] rounded-2xl overflow-hidden shadow-2xl bg-black/10">
                <Image
                  src="/images/varios_clientes_de_frente_posando_para_foto.webp"
                  alt="Clientes felices posando en Xiorizos Venezuela"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
