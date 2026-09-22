import Link from "next/link";
import Image from "next/image";
import { Calendar, Palette, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestimonialCard, type Testimonial } from "@/components/shop/testimonial-card";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const HERO_VIDEO_URL =
  "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/a/CleanShot%202026-07-31%20at%2007.43.14.mp4";

const servicios = [
  {
    icon: ShoppingBag,
    titulo: "Tienda especializada",
    descripcion: "Productos capilares profesionales seleccionados por nuestros estilistas.",
    href: "/catalogo",
  },
  {
    icon: Calendar,
    titulo: "Agenda tu cita",
    descripcion: "Reserva en minutos con el profesional y horario que prefieras.",
    href: "/citas",
  },
  {
    icon: Palette,
    titulo: "Simulador de color",
    descripcion: "Prueba tonos de cabello sobre tu propia foto antes de decidir.",
    href: "/simulador",
  },
];

const testimonios: Testimonial[] = [
  {
    id: "t1",
    nombre: "María González",
    rol: "Cliente frecuente",
    calificacion: 5,
    comentario:
      "El resultado del balayage superó lo que imaginaba. Andrea entendió exactamente el tono que quería y el ambiente del salón es súper acogedor.",
  },
  {
    id: "t2",
    nombre: "Luisa Fernández",
    rol: "Cliente desde 2024",
    calificacion: 5,
    comentario:
      "Usé el simulador de color antes de mi cita y llegué sabiendo exactamente qué pedir. Me ahorró muchas dudas y el proceso fue muy rápido.",
  },
  {
    id: "t3",
    nombre: "Valentina Ruiz",
    rol: "Cliente nueva",
    calificacion: 4,
    comentario:
      "Agendar la cita en línea fue muy fácil y pude elegir el horario que mejor me convenía. Los productos que compré también son excelentes.",
  },
  {
    id: "t4",
    nombre: "Carla Méndez",
    rol: "Cliente frecuente",
    calificacion: 5,
    comentario:
      "Llevo dos años viniendo a Xiorizos para mis retoques de color. Siempre salgo feliz con el resultado y el trato es excelente.",
  },
];

export default function LandingPage() {
  const destacados = mockProducts.slice(0, 4);

  return (
    <div>
      {/* Hero con video de fondo */}
      <section className="relative flex h-[90vh] min-h-[560px] w-full items-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Overlay: garantiza contraste de texto sobre el video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Salón de belleza & colorimetría
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl">
              Tu cabello, tu color, <span className="text-primary">tu Xiorizos</span>
            </h1>
            <p className="mt-4 max-w-md text-white/90 drop-shadow-sm">
              Agenda tu cita, compra tus productos favoritos y simula tu próximo color de
              cabello antes de decidirte. Todo en un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/citas">
                  Agendar cita <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/simulador">Probar simulador de color</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {servicios.map((servicio) => {
            const Icon = servicio.icon;
            return (
              <Link key={servicio.titulo} href={servicio.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold">{servicio.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Reseñas / Testimonios */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Testimonios
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
            Lo que dicen nuestras clientas
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Cientos de clientas confían en Xiorizos para su cuidado capilar y colorimetría.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonios.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Productos destacados</h2>
            <Link href="/catalogo" className="text-sm font-medium text-primary hover:underline">
              Ver todo →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {destacados.map((product) => (
              <Link key={product.id} href={`/catalogo/${product.id}`}>
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-square w-full bg-secondary">
                    <Image src={product.imagenUrl} alt={product.nombre} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">{product.marca}</p>
                    <p className="line-clamp-1 text-sm font-medium">{product.nombre}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-semibold">{formatCurrency(product.precio)}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
