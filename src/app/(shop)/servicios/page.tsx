import Image from "next/image";
import Link from "next/link";
import { OptimizedVideo } from "@/components/ui/optimized-video";
import { mockServices } from "@/lib/mock-data";

export const metadata = {
  title: "Nuestros Servicios | Xiorizos Salón & Studio",
  description:
    "Descubre todos los servicios especializados para rizos, ondas y cabello afro en Valencia, además de nuestro exclusivo servicio de uñas.",
};

export default function ServiciosPage() {
  const nailService = mockServices.find((s) => s.id === "s12") || mockServices[mockServices.length - 1];
  const hairServices = mockServices.filter((s) => s.id !== nailService.id);

  return (
    <div className="w-full bg-background pt-28 pb-20 font-body-md text-on-surface">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">Servicios</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="font-label-md text-xs uppercase tracking-wider text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full">
            Nuestros Rituales & Especialidades
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-5xl font-bold text-primary tracking-tight mt-3">
            Servicios diseñados para la salud y forma de tus rizos
          </h1>
          <p className="font-body-md text-base sm:text-lg text-on-surface-variant mt-4 leading-relaxed">
            Cada servicio incluye asesoría personalizada y productos formulados botánicamente para proteger la elasticidad y nutrición de tu textura.
          </p>
        </div>

        {/* Grid of Hair Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {hairServices.map((service) => (
            <div
              id={`servicio-${service.id}`}
              key={service.id}
              className="scroll-mt-28 bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-full h-52 rounded-2xl overflow-hidden relative mb-4 bg-surface-container-low">
                  <Image
                    src={service.imagenUrl || "/images/Full_curl.webp"}
                    alt={service.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {service.categoria}
                  </span>
                </div>

                <h2 className="font-headline-sm text-lg font-bold text-primary mb-2">
                  {service.nombre}
                </h2>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {service.descripcion}
                </p>

                {/* Items list */}
                {service.items && (
                  <ul className="space-y-1.5 mb-4 text-xs text-on-surface">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px] flex-shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {service.nota && (
                  <p className="text-xs italic text-secondary mb-4">
                    * {service.nota}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-surface-container flex items-center justify-between mt-auto">
                <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {service.duracionMin} min aprox.
                </span>
                <Link
                  href={`/citas?servicio=${service.id}`}
                  className="bg-primary text-on-primary font-label-md text-xs px-5 py-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Agendar Cita
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Section: Servicio de Uñas (Un solo contenedor centrado, texto a la izquierda, video pegado a la derecha sin espacio gris) */}
        <div className="flex justify-center w-full mb-16" id={`servicio-${nailService.id}`}>
          <div className="scroll-mt-28 max-w-fit mx-auto bg-surface-container-low border border-surface-container rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch">
            {/* Texto a la izquierda */}
            <div className="w-full md:w-[400px] lg:w-[460px] p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 md:order-1">
              <span className="bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-2">
                Cuidado Integral
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary mb-3">
                {nailService.nombre}
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                {nailService.descripcion} En manos de nuestra especialista Yakeline Daboin, disfruta de un momento de consentirte mientras cuidamos tus rizos o en una sesión exclusiva.
              </p>

              {nailService.items && (
                <ul className="space-y-2 text-xs text-on-surface mb-6">
                  {nailService.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/citas?servicio=${nailService.id}`}
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-sm px-6 py-3 rounded-full shadow hover:scale-105 active:scale-95 transition-all w-fit"
              >
                <span>Agendar Servicio de Uñas</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </Link>
            </div>

            {/* Video Servicio de Uñas pegado a la derecha del texto, sin espacio gris, sin recortar */}
            <div className="flex-shrink-0 flex items-center justify-center bg-black/5 overflow-hidden order-1 md:order-2">
              <OptimizedVideo
                src="/videos/servicio_de_unas.mp4"
                poster="/images/servicio_de_unas.webp"
                className="h-[360px] sm:h-[440px] md:h-[480px] w-auto max-w-full block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
