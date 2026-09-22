import Link from "next/link";
import { Scissors, Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

const columnas = [
  {
    titulo: "Tienda",
    links: [
      { href: "/catalogo", label: "Catálogo" },
      { href: "/catalogo?categoria=Tintes", label: "Tintes" },
      { href: "/catalogo?categoria=Tratamientos", label: "Tratamientos" },
    ],
  },
  {
    titulo: "Servicios",
    links: [
      { href: "/citas", label: "Agendar cita" },
      { href: "/simulador", label: "Simulador de color" },
    ],
  },
  {
    titulo: "Empresa",
    links: [
      { href: "/nosotros", label: "Sobre nosotros" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="font-heading text-lg font-bold">Xiorizos</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Salón de belleza especializado en colorimetría capilar, con tienda en línea y
              agendamiento de citas.
            </p>
            <div className="mt-4 flex gap-3">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </div>
          </div>

          {columnas.map((col) => (
            <div key={col.titulo}>
              <h4 className="font-heading text-sm font-semibold">{col.titulo}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-heading text-sm font-semibold">Contacto</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Av. Principal, Local 4
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                +58 412 000 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                contacto@xiorizos.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Xiorizos. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
