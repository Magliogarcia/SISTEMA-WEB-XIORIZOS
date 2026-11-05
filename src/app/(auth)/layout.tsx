import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#FAF3EA] via-[#F3E5D4] to-[#E8D4BE] px-4 py-10 overflow-hidden">
      {/* Elementos decorativos de color cálido en el fondo para eliminar la frialdad blanca */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/25 to-[#855230]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tl from-[#C07037]/25 to-amber-300/20 blur-3xl" />

      {/* Logo de Xiorizos con marco cálido */}
      <Link
        href="/"
        className="relative z-10 mb-7 block transition-transform hover:scale-105 drop-shadow-sm"
      >
        <Image
          src="/images/Logo_completo_horizontal.webp"
          alt="Xiorizos"
          width={210}
          height={56}
          className="h-12 w-auto object-contain"
          priority
        />
      </Link>

      {/* Tarjeta con acento de color cálido, bordes definidos y tipografía sólida */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-md border border-[#E2CEBA] bg-white shadow-[0_8px_30px_rgb(133,82,48,0.12)]">
        {/* Franja superior con degradado insignia de Xiorizos */}
        <div className="h-2 w-full bg-gradient-to-r from-[#855230] via-[#C07037] to-[#D97706]" />
        
        <div className="p-7 sm:p-8">
          {children}
        </div>
      </div>

      {/* Pie sutil */}
      <p className="relative z-10 mt-6 text-center text-xs font-bold text-[#855230]/80">
        Salón Especialista en Rizos, Ondas y Afro &bull; Valencia, Venezuela
      </p>
    </div>
  );
}
