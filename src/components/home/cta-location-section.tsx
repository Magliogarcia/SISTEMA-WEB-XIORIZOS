export function CtaLocationSection() {
  return (
    <section className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin pb-space-xl" id="contacto">
      <div className="w-full bg-primary text-on-primary rounded-[40px] p-space-lg md:p-space-xl shadow-[0_24px_48px_-8px_rgba(18,18,18,0.28)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          
          {/* Left info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <span className="font-label-sm text-label-sm text-secondary-container tracking-widest uppercase font-semibold">
              Xiorizos Salón &amp; Estudio
            </span>
            <h2 className="font-display-hero-mobile md:font-headline-lg text-display-hero-mobile md:text-headline-lg text-on-primary">
              Tu cabello habla.<br />
              Nosotras lo escuchamos.
            </h2>
            <p className="font-body-md text-body-md text-primary-fixed-dim max-w-xl">
              Especialistas en la salud, definición y color de tu cabello rizado, ondulado y afro.
              Ven a visitarnos en Naguanagua o escríbenos directamente por WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-container text-[22px]">
                  location_on
                </span>
                <div>
                  <p className="font-title-md text-[15px] font-bold">Ubicación</p>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                    Planta Baja, Torre Anexa
                  </p>
                  <p className="text-xs text-[#febb90]">
                    Centro Científico del Norte, Naguanagua, Valencia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-container text-[22px]">
                  schedule
                </span>
                <div>
                  <p className="font-title-md text-[15px] font-bold">Horario de Atención</p>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                    Mar - Sáb: 8:30 a.m. – 5:30 p.m.
                  </p>
                  <p className="text-xs text-rose-300">Domingos y lunes cerrado</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm pt-4">
              <a
                className="inline-flex items-center gap-2 bg-on-primary text-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-secondary-fixed hover:scale-105 transition-all shadow-md font-semibold"
                href="https://wa.me/584127434761"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Escríbenos: +58 412 7434761</span>
              </a>

              <a
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-on-primary-fixed-variant transition-all border border-white/10"
                href="https://maps.app.goo.gl/A5WyREVTwa24HHCD8"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px] text-[#febb90]">near_me</span>
                <span>Cómo llegar</span>
              </a>
            </div>
          </div>

          {/* Right Mini Location Map (5 cols) */}
          <div className="lg:col-span-5">
            <div className="w-full h-72 md:h-80 rounded-3xl overflow-hidden shadow-inner relative border border-white/10 bg-surface-container-high">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.912654181088!2d-68.01803703568429!3d10.268621460254534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e80693dfebf5427%3A0xd6a2455c564a1916!2sXio%20Rizos%20Venezuela!5e0!3m2!1ses!2sus!4v1793618963982!5m2!1ses!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Ubicación Xio Rizos Venezuela"
                className="w-full h-full object-cover filter contrast-[1.05]"
              />
              <a
                href="https://maps.app.goo.gl/A5WyREVTwa24HHCD8"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-primary/85 hover:bg-primary backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 text-on-primary font-label-sm text-label-sm transition-all shadow-md hover:scale-105"
              >
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  near_me
                </span>
                <span>Abrir en Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
