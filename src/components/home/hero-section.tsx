import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[640px] md:min-h-[720px] flex items-center" id="experiencia">
      {/* Panoramic Full-Bleed Cover Background Image (Starts from top y=0) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.png"
          alt="Salón Xiorizos - Especialistas en cabello ondulado, rizado y afro"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Deep Warm/Dark Overlay for Readability & Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#18110b]/75 to-black/55 md:to-transparent backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Centered Inner Content Container */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col items-start gap-space-md">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-surface-container-lowest/15 backdrop-blur-md border border-white/20 text-[#ffdbc7] font-label-md text-label-md px-4 py-1.5 rounded-full shadow-sm">
          <span
            className="material-symbols-outlined text-[16px] text-secondary-fixed"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            spa
          </span>
          <span>Especialistas en Ondas, Rizos y Afro</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-white tracking-tight leading-tight">
          Tu cabello habla.<br />
          <span className="text-[#febb90]">Nosotras lo escuchamos.</span>
        </h1>

        {/* Subtext */}
        <p className="font-body-lg text-body-lg text-white/85 max-w-xl leading-relaxed">
          Cuidado experto y personalizado para ondas, rizos y cabello afro en Valencia. Realzamos tu textura natural con los mejores tratamientos.
        </p>

        {/* CTA Pill Actions */}
        <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
          <Link
            href="/citas"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-label-lg text-label-lg px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:bg-[#ffdbc7] hover:scale-105 active:scale-95 transition-all font-semibold"
          >
            <span>Reservar cita</span>
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          </Link>

          <Link
            href="/simulador"
            className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 backdrop-blur-md border border-white/30 text-white font-label-lg text-label-lg px-8 py-3.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <span>Probar mi nuevo color</span>
            <span className="material-symbols-outlined text-[18px] text-[#febb90]">palette</span>
          </Link>
        </div>

        {/* Floating Trust Indicator on Dark Overlay */}
        <div className="flex flex-wrap items-center gap-3 pt-space-xs bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="flex -space-x-2">
            <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-black/50 shadow-sm">✓</span>
            <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-black/50 shadow-sm">★</span>
            <span className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-black/50 shadow-sm">♥</span>
          </div>
          <span className="font-label-sm text-label-sm text-white/90 font-medium">
            +1.500 rizos transformados con amor y ciencia
          </span>
        </div>
      </div>
    </section>
  );
}
