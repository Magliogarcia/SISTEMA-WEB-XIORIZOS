import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { AboutSection } from "@/components/home/about-section";
import { SimulatorSection } from "@/components/home/simulator-section";
import { ShopSection } from "@/components/home/shop-section";
import { BookingSection } from "@/components/home/booking-section";
import { TeamSection } from "@/components/home/team-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaLocationSection } from "@/components/home/cta-location-section";

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
