import Image from "next/image";
import Link from "next/link";
import { realStaffMembers } from "@/lib/mock-data";

export const metadata = {
  title: "Sobre Nosotros | Xiorizos Salón & Studio Valencia",
  description:
    "Conoce al equipo de Xiorizos: especialistas certificados en cabello ondulado, rizado y afro en Naguanagua, Valencia, Venezuela.",
};

export default function SobreNosotrosPage() {
  return (
    <div className="w-full bg-background pt-28 pb-20 font-body-md text-on-surface">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">Sobre Nosotros</span>
        </nav>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12">
          <span className="font-label-md text-xs uppercase tracking-wider text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full">
            Nuestra Esencia & Equipo
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-5xl font-bold text-primary tracking-tight mt-3">
            El primer estudio dedicado 100% a tus rizos en Valencia
          </h1>
          <p className="font-body-md text-base sm:text-lg text-on-surface-variant mt-4 leading-relaxed">
            En Xiorizos no buscamos cambiar tu cabello; te enseñamos a amarlo, cuidarlo y lucirlo con orgullo. Sin alisados ni promesas falsas: pura salud capilar, diagnóstico real y técnicas botánicas.
          </p>
        </div>

        {/* Walkthrough Video Showcase (Un solo contenedor centrado, video a la derecha del margen izquierdo, pegado al texto sin espacio gris) */}
        <div className="flex justify-center w-full mb-16">
          <div className="max-w-fit mx-auto bg-surface-container-low border border-surface-container rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch">
            {/* Video sin recortar, ajustado a su ancho natural y pegado al texto */}
            <div className="flex-shrink-0 flex items-center justify-center bg-black/5 overflow-hidden">
              <video
                src="/videos/video_recorrido_por_negocio.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                className="h-[360px] sm:h-[440px] md:h-[480px] w-auto max-w-full block"
              />
            </div>

            {/* Texto pegado al video dentro del mismo contenedor */}
            <div className="w-full md:w-[400px] lg:w-[460px] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-secondary text-xs font-semibold uppercase tracking-wider">
                Nuestras Instalaciones
              </span>
              <h2 className="font-headline-md text-2xl font-bold text-primary mt-1 mb-3">
                Un santuario para tus ondas y rizos
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
                Ubicados en la Planta Baja de la Torre Anexa del Centro Científico Metropolitano del Norte en Naguanagua. Espacios diseñados para tu relax: música agradable, asesoría personalizada y un trato cálido y humano.
              </p>
              <div className="space-y-2.5 text-xs text-on-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Diagnóstico capilar con capilógrafo digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Corte especializado en seco y húmedo según tu patrón</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Líneas capilares botánicas sin sulfatos ni siliconas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Staff Cards (All 7 real staff members) */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-label-md text-xs uppercase tracking-wider text-secondary font-semibold">
              Equipo Humano
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-4xl font-bold text-primary mt-1">
              Conoce a quienes cuidarán tu cabello
            </h2>
            <p className="text-on-surface-variant text-sm mt-2">
              Desde la dirección y administración hasta nuestras especialistas en corte, color, terapias y uñas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {realStaffMembers.map((member) => (
              <div
                key={member.id}
                className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm flex flex-col items-center text-center group hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container mb-4 relative shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={member.imagenUrl}
                    alt={member.nombre}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-primary">
                  {member.nombre}
                </h3>
                <span className="font-label-sm text-xs text-secondary bg-secondary/10 px-3 py-1 rounded-full mt-1.5 font-medium">
                  {member.cargo}
                </span>
                <span className="text-[11px] text-on-surface-variant/80 mt-1 font-semibold">
                  Especialidad: {member.especialidad}
                </span>
                <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                  {member.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Galería de Momentos del Personal */}
        <div className="mb-16">
          <h2 className="font-headline-md text-2xl font-bold text-primary mb-6">
            Nuestros días en el salón
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm border border-surface-container">
              <Image
                src="/images/Personal1.webp"
                alt="Personal Xiorizos en acción"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm border border-surface-container">
              <Image
                src="/images/Personal2.webp"
                alt="Especialistas de Xiorizos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm border border-surface-container">
              <Image
                src="/images/personal3.webp"
                alt="Equipo Xiorizos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Comunidad Xiorizos */}
        <div className="rounded-3xl overflow-hidden bg-primary text-on-primary p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Nuestra Comunidad
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4 leading-snug">
                Más que clientas, somos una gran red de amor propio
              </h2>
              <p className="text-on-primary/90 text-sm leading-relaxed mb-6">
                Desde niñas hasta adultas mayores, hombres y jóvenes. Cada persona que pasa por nuestras sillas se lleva una rutina clara, rizos hidratados y la seguridad de lucir su textura sin complejos.
              </p>
              <Link
                href="/citas"
                className="inline-flex items-center gap-2 bg-white text-primary font-label-md text-sm px-6 py-3 rounded-full shadow hover:scale-105 active:scale-95 transition-all"
              >
                <span>Agendar mi primera cita</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </Link>
            </div>
            <div className="lg:col-span-6">
              <div className="relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-2xl bg-black/10">
                <Image
                  src="/images/varios_clientes_de_frente_posando_para_foto.webp"
                  alt="Clientas felices en Xiorizos"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
