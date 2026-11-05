"use client";

import { useRef } from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Mariana Rodríguez",
    zone: "Valencia, Carabobo",
    quote: "“Mis rizos nunca habían tenido tanta definición y soltura. El diagnóstico con el capilógrafo me abrió los ojos sobre cómo cuidar mi patrón.”",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Daniela González",
    zone: "Naguanagua",
    quote: "“Tenía miedo de hacerme color en mis crespos, pero el Curly Color no me resecó nada. Quedaron brillantes y el tono es perfecto.”",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Camila Terán",
    zone: "San Diego",
    quote: "“La atención es súper cercana y te explican paso a paso cómo mantener el rizo en casa. El corte en seco es una maravilla.”",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Andrea Castillo",
    zone: "El Trigal, Valencia",
    quote: "“El tratamiento Renacer Capilar salvó mi cabello después de años de plancha. Por fin recuperé mi textura natural sin batallar.”",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Valeria Mendoza",
    zone: "Guataparo, Valencia",
    quote: "“Llevé a mi hija para el servicio Curly Girls y la paciencia fue única. Le enseñaron a amar sus rizos desde pequeña.”",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Alejandro Pérez",
    zone: "Naguanagua",
    quote: "“Excelente opción para hombres con cabello ondulado y rizado. El Curly Men te deja el corte impecable y sin frizz.”",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Stefany Blanco",
    zone: "Prebo, Valencia",
    quote: "“El gel definidor y la mascarilla que me recomendaron son los únicos que de verdad me aguantan la humedad de Valencia.”",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Paola Silva",
    zone: "Carabobo",
    quote: "“La terapia de Crecimiento Capilar con alta frecuencia me ayudó muchísimo con la caída. Es un lugar donde de verdad entienden el rizo afro.”",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Gabriela Colmenares",
    zone: "Los Naranjos, Valencia",
    quote: "“Ir a Xiorizos es una terapia. Por fin un salón donde no me dicen 'vamos a pasarte un cepillo para bajarte el volumen'. ¡Aquí celebran mis rizos!”",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Yusneidy Rondón",
    zone: "La Granja, Naguanagua",
    quote: "“El servicio de uñas de Yakeline y la definición de rizos el mismo día fue mi mejor experiencia de consentirme. Salí renovada por completo.”",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80",
  },
];

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const scrollAmount = 340;
    const { scrollLeft, scrollWidth, clientWidth } = track;

    if (direction === "left") {
      if (scrollLeft <= 10) {
        track.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else {
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="w-full py-space-xl bg-background overflow-hidden" id="testimonios">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-space-lg">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Comunidad Xiorizos
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
              Lo Que Dicen Nuestras Clientas
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Experiencias reales de quienes confían sus ondas, rizos y afro en nuestras manos.
            </p>
          </div>

          {/* Flechas de Navegación Manual */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Ver testimonios anteriores"
              className="w-11 h-11 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary flex items-center justify-center shadow-sm border border-surface-container transition-all active:scale-90 hover:scale-105"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Ver siguientes testimonios"
              className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 text-on-primary flex items-center justify-center shadow-sm transition-all active:scale-90 hover:scale-105"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Carrusel Deslizable Nativo y Fluido (Snap) */}
        <div
          ref={trackRef}
          className="flex gap-space-md overflow-x-auto pb-6 pt-1 select-none scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="snap-start flex-shrink-0 w-[290px] sm:w-[330px] bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-surface-container hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div>
                {/* 5 Estrellas */}
                <div className="flex text-secondary gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-sm md:text-base text-primary font-medium leading-relaxed">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-surface-container mt-4">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-surface-container relative flex-shrink-0 shadow-sm">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-label-md text-sm text-primary font-bold">
                    {t.name}
                  </p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant">
                    {t.zone} • Cliente verificada
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
