import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-[#121212] text-white pt-16 pb-12 mt-12 border-t border-white/5">
      <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin">
        {/* 4 Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Columna 1 (Marca & Redes) - 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center">
              <Image
                src="/images/Logo_completo_horizontal.webp"
                alt="Logo Xiorizos"
                width={220}
                height={60}
                className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="font-body-sm text-body-sm text-[#c8c6c5] leading-relaxed">
              Salón y estudio especializado exclusivamente en el cuidado, corte, coloración y
              definición de cabello ondulado, rizado y afro en Valencia, Venezuela.
            </p>
            {/* Social Interactive Icons Row (Solo Instagram, TikTok y Facebook) */}
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                aria-label="Instagram Xiorizos"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ffdbc7] hover:text-[#121212] text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                href="https://www.instagram.com/xiorizos/?hl=es"
                rel="noopener noreferrer"
                target="_blank"
                title="Instagram (@xiorizos)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                aria-label="TikTok Xiorizos"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ffdbc7] hover:text-[#121212] text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                href="https://www.tiktok.com/@xio_rizos?is_from_webapp=1&sender_device=pc"
                rel="noopener noreferrer"
                target="_blank"
                title="TikTok (@xio_rizos)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                aria-label="Facebook Tienda Xiorizos"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ffdbc7] hover:text-[#121212] text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                href="https://www.facebook.com/tiendaxiorizos/"
                rel="noopener noreferrer"
                target="_blank"
                title="Facebook (tiendaxiorizos)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 (Navegación) - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-headline-sm text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <span>Secciones</span>
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-[#c8c6c5]">
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-all" href="/servicios">
                  Servicios y Tratamientos
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-all" href="/nosotros">
                  Sobre Nosotros & Equipo
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-all" href="/simulador">
                  Simulador de Color
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-all" href="/catalogo">
                  Tienda de Productos
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-all" href="/citas">
                  Agendar Cita Online
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:translate-x-1 inline-block transition-all" href="/#testimonios">
                  Testimonios Reales
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 (Contacto) - 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="font-headline-sm text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <span>Contacto</span>
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            </h3>
            <div className="flex flex-col gap-3 font-body-sm text-body-sm text-[#c8c6c5]">
              <div>
                <p className="text-white font-medium text-[13px]">Teléfono y WhatsApp</p>
                <a
                  href="https://wa.me/584127434761"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-[#febb90] transition-colors block font-semibold mt-0.5"
                >
                  +58 412 7434761
                </a>
              </div>
              <div>
                <p className="text-white font-medium text-[13px]">Correo Electrónico</p>
                <a className="text-white/80 hover:text-white block transition-colors" href="mailto:hola@xiorizos.com">
                  hola@xiorizos.com
                </a>
              </div>
              <div>
                <p className="text-white font-medium text-[13px]">Atención Especial</p>
                <p className="text-white/80 text-[12px] leading-snug">
                  Citas, dudas y asesorías para tu tipo de rizo.
                </p>
              </div>
            </div>
          </div>

          {/* Columna 4 (Ubicación & Horarios - Sin recuadro) - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-headline-sm text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <span>Ubicación y Horarios</span>
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            </h3>
            <div className="flex flex-col gap-3 font-body-sm text-body-sm text-[#c8c6c5]">
              <div>
                <p className="text-white font-medium flex items-center gap-1.5 text-[14px]">
                  <span className="material-symbols-outlined text-[#febb90] text-[16px]">location_on</span>
                  Salón Xio Rizos
                </p>
                <p className="pl-6 text-white/80 text-[13px] leading-relaxed">
                  Planta Baja, Torre Anexa, Centro Científico Metropolitano del Norte, Naguanagua, Valencia, Carabobo.
                </p>
                <a
                  href="https://maps.app.goo.gl/A5WyREVTwa24HHCD8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-6 text-[12px] text-[#febb90] hover:underline flex items-center gap-1 mt-1 font-medium"
                >
                  Ver en Google Maps
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>

              {/* Horarios limpios sin contenedor ni recuadro */}
              <div className="pt-2">
                <p className="text-white font-medium text-[13px] flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[#febb90] text-[15px]">schedule</span>
                  Horarios de Atención:
                </p>
                <p className="pl-5 text-white/80 text-[12.5px]">Martes a Sábado: 8:30 a.m. a 5:30 p.m.</p>
                <p className="pl-5 text-rose-300 text-[12.5px] pt-0.5">Domingos y Lunes: Cerrado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior (Bottom Bar) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[#c8c6c5] font-label-sm text-label-sm">
          <p>© {new Date().getFullYear()} Xiorizos. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link className="hover:text-white transition-colors" href="#">
              Aviso Legal
            </Link>
            <Link className="hover:text-white transition-colors" href="#">
              Política de Privacidad
            </Link>
            <Link className="hover:text-white transition-colors" href="#">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
