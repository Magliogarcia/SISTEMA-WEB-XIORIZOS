"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Sobre Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Simulador", href: "/simulador" },
  { label: "Productos", href: "/catalogo" },
  { label: "Reservar", href: "/citas" },
];

export function Navbar() {
  const pathname = usePathname();
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const openCart = useCartStore((state) => state.openCart);
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="h-24 max-w-[1320px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between">
          
          {/* Brand Logo Pill (Usa Logo_completo_horizontal.webp sin recortes) */}
          <Link
            href="/"
            className="pointer-events-auto flex items-center bg-surface-container-lowest/90 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_12px_32px_-4px_rgba(61,34,20,0.08)] transition-all hover:shadow-[0_16px_36px_-4px_rgba(61,34,20,0.12)] hover:scale-[1.02]"
            aria-label="Xiorizos Inicio"
          >
            <Image
              src="/images/Logo_completo_horizontal.webp"
              alt="Xiorizos"
              width={140}
              height={38}
              className="h-8 md:h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Center Pill with Multi-page routing */}
          <nav className="pointer-events-auto hidden xl:flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full p-1.5 shadow-[0_12px_32px_-4px_rgba(61,34,20,0.08)]">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls Pill */}
          <div className="pointer-events-auto flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md rounded-full p-2 shadow-[0_12px_32px_-4px_rgba(61,34,20,0.08)]">
            {/* Bolsa de compras */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface"
              type="button"
              aria-label="Abrir bolsa de compras"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] px-1 shadow-[0_2px_8px_rgba(90,53,30,0.25)]">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Cita Online button (desktop) */}
            <Link
              href="/citas"
              className="hidden sm:inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(18,18,18,0.18)] hover:scale-105 active:scale-95 transition-all"
            >
              Cita Online
            </Link>

            {/* Cuenta / Perfil */}
            <Link
              href={isAuthenticated ? "/perfil" : "/login"}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary hover:scale-105 transition-transform"
              aria-label="Mi Cuenta"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>

            {/* Menú de Hamburguesa en Móvil y pantallas medianas */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface"
              type="button"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown Modal */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-24 inset-x-4 max-w-sm mx-auto bg-surface-container-lowest rounded-3xl p-5 shadow-2xl border border-surface-container animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl font-title-md text-[15px] font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-on-primary"
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                );
              })}

              <div className="pt-3 mt-1 border-t border-surface-container flex flex-col gap-2">
                <Link
                  href="/citas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-primary text-on-primary font-label-md py-3 rounded-full shadow-md"
                >
                  Agendar Cita Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
