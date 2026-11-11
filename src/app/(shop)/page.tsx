import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";

// Secciones pesadas cargadas dinámicamente (solo se descargan cuando el navegador las necesita)
const AboutSection = dynamic(
  () =>
    import("@/components/home/about-section").then((m) => ({
      default: m.AboutSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-xl bg-surface-container-lowest">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-96 animate-pulse bg-surface-container-low rounded-3xl" />
      </div>
    ),
  }
);

const SimulatorSection = dynamic(
  () =>
    import("@/components/home/simulator-section").then((m) => ({
      default: m.SimulatorSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-72 animate-pulse bg-surface-container-low rounded-3xl" />
      </div>
    ),
  }
);

const ShopSection = dynamic(
  () =>
    import("@/components/home/shop-section").then((m) => ({
      default: m.ShopSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-xl bg-surface-container-low">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-72 animate-pulse bg-surface-container rounded-3xl" />
      </div>
    ),
  }
);

const BookingSection = dynamic(
  () =>
    import("@/components/home/booking-section").then((m) => ({
      default: m.BookingSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-lg">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-48 animate-pulse bg-surface-container-low rounded-3xl" />
      </div>
    ),
  }
);

const TeamSection = dynamic(
  () =>
    import("@/components/home/team-section").then((m) => ({
      default: m.TeamSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-72 animate-pulse bg-surface-container-low rounded-3xl" />
      </div>
    ),
  }
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/home/testimonials-section").then((m) => ({
      default: m.TestimonialsSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-xl bg-surface-container-low">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-48 animate-pulse bg-surface-container rounded-3xl" />
      </div>
    ),
  }
);

const CtaLocationSection = dynamic(
  () =>
    import("@/components/home/cta-location-section").then((m) => ({
      default: m.CtaLocationSection,
    })),
  {
    loading: () => (
      <div className="w-full py-space-xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin h-72 animate-pulse bg-surface-container-low rounded-3xl" />
      </div>
    ),
  }
);

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full font-body-md text-on-surface bg-background">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. NUESTROS SERVICIOS (Doble carrusel infinito 6 arriba y 6 abajo) */}
      <ServicesSection />

      {/* 3. SOBRE NOSOTROS (Video recorrido, fotos de equipo, clientes) */}
      <AboutSection />

      {/* 4. SIMULADOR VIRTUAL DE COLOR (Sin arrastre fantasma en desktop) */}
      <SimulatorSection />

      {/* 5. TIENDA DE PRODUCTOS (Video uncropped, preview, link a catálogo) */}
      <ShopSection />

      {/* 6. RESERVAR CITA ONLINE (CTA compacto que redirige a /citas) */}
      <BookingSection />

      {/* 7. TALENTO HUMANO / EQUIPO REAL */}
      <TeamSection />

      {/* 8. TESTIMONIOS (Carrusel infinito suave y reactivo) */}
      <TestimonialsSection />

      {/* 9. UBICACIÓN, HORARIOS & GOOGLE MAPS REAL */}
      <CtaLocationSection />
    </div>
  );
}
