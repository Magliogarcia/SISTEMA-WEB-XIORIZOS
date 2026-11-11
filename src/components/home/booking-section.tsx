"use client";

import Image from "next/image";
import Link from "next/link";

export function BookingSection() {
  return (
    <section className="w-full py-space-xl bg-surface-container-lowest" id="reservar">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[#24140c] text-on-primary p-7 sm:p-10 md:p-12 shadow-xl border border-primary/20">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  <span>Citas Online</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#FFF275] text-[#121212] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  <span>¡Disponible con Cashea!</span>
                </span>
              </div>

              <h2 className="font-headline-lg text-2xl md:text-4xl font-bold mb-3 tracking-tight leading-tight">
                ¿Lista o listo para darle vida a tus rizos?
              </h2>

              <p className="font-body-md text-on-primary/90 text-sm sm:text-base leading-relaxed mb-6">
                Elige tu servicio favorito y atiéndete con nuestras especialistas en Naguanagua de martes a sábado (8:30 a.m. a 5:30 p.m.). Además, puedes pagar tanto tus servicios en salón como tus productos en cuotas sin interés a través de <strong>Cashea</strong>.
              </p>

              {/* Quick Benefits Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl text-xs font-medium">
                  <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
                  <span>Paga en cuotas con Cashea</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl text-xs font-medium">
                  <span className="material-symbols-outlined text-secondary text-[18px]">biotech</span>
                  <span>Diagnóstico con capilógrafo</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl text-xs font-medium">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Especialistas certificadas</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/citas"
                  className="inline-flex items-center gap-2 bg-white text-primary hover:bg-[#FAF6F0] font-label-md text-sm font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Agendar Cita Online</span>
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                </Link>
                <a
                  href="https://wa.me/584127434761?text=Hola%20Xiorizos,%20quisiera%20consultar%20por%20una%20cita%20con%20Cashea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white border border-white/30 hover:bg-white/10 font-label-md text-sm font-medium px-5 py-3 rounded-full transition-all"
                >
                  <span>Consultar por WhatsApp</span>
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                </a>
              </div>
            </div>

            {/* Right Card: Cashea Highlight Badge */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center flex flex-col items-center shadow-lg">
                <div className="relative w-36 h-12 mb-3">
                  <Image
                    src="/images/logo_cashea.webp"
                    alt="Logo Cashea"
                    fill
                    sizes="144px"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-white text-sm mb-1">
                  Compra ahora, paga después
                </span>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Divide tu pago en cómodas cuotas sin interés para tus productos y servicios en el estudio.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FFF275] bg-white/10 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Aliado comercial oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
