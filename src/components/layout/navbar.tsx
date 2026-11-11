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
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="h-20 sm:h-24 max-w-[1320px] mx-auto px-3 sm:px-margin-mobile md:px-margin flex items-center justify-between gap-2">
          
          {/* Brand Logo Pill */}
          <Link
            href="/"
            className="pointer-events-auto flex items-center bg-surface-container-lowest/90 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_12px_32px_-4px_rgba(61,34,20,0.08)] transition-all hover:shadow-[0_16px_36px_-4px_rgba(61,34,20,0.12)] hover:scale-[1.02] shrink-0"
            aria-label="Xiorizos Inicio"
          >
            <Image
              src="/images/Logo_completo_horizontal.webp"
              alt="Xiorizos"
              width={140}
              height={38}
              className="h-7 sm:h-8 md:h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Center Pill */}
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
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-surface-container-lowest/90 backdrop-blur-md rounded-full p-1.5 sm:p-2 shadow-[0_12px_32px_-4px_rgba(61,34,20,0.08)] shrink-0">
            {/* Bolsa de compras */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface"
              type="button"
              aria-label="Abrir bolsa de compras"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">shopping_bag</span>
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center rounded-full bg-secondary text-on-secondary font-label-sm text-[9px] sm:text-[10px] px-1 shadow-[0_2px_8px_rgba(90,53,30,0.25)]">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Cita Online button (desktop) */}
            <Link
              href="/citas"
              className="hidden sm:inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_4px_14px_rgba(18,18,18,0.18)] hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
            >
              Cita Online
            </Link>

            {/* Acceso directo a Panel si es administrador o empleado */}
            {(user?.rol === "admin" || user?.rol === "empleado" || user?.rol === "estilista") && (
              <Link
                href={user.rol === "admin" ? "/admin" : "/admin/citas"}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-secondary text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
                title={user.rol === "admin" ? "Ir al Panel de Administración" : "Ir al Panel de Mi Agenda"}
              >
                <span>Ir al panel</span>
              </Link>
            )}

            {/* Botón de Perfil / Iniciar Sesión: abre siempre /login al darle clic */}
            <Link
              href="/login"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-on-primary hover:scale-105 active:scale-95 transition-transform shadow-sm"
              aria-label="Perfil y Login"
              title={isAuthenticated ? `Mi Perfil (${user?.nombre}) - Iniciar sesión / Gestionar cuenta` : "Iniciar sesión"}
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">person</span>
            </Link>

            {/* Menú de Hamburguesa en Móvil y pantallas medianas */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface"
              type="button"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
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
            className="fixed top-20 sm:top-24 inset-x-3 sm:inset-x-4 max-w-sm mx-auto bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-2xl border border-surface-container animate-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-6rem)] overflow-y-auto"
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
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-surface-container-low text-primary font-semibold text-sm hover:bg-surface-container"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>{isAuthenticated ? `Mi Perfil (${user?.nombre})` : "Iniciar sesión / Perfil"}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>

                {(user?.rol === "admin" || user?.rol === "empleado" || user?.rol === "estilista") && (
                  <Link
                    href={user.rol === "admin" ? "/admin" : "/admin/citas"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-secondary text-white font-label-md py-2.5 rounded-full shadow-md text-sm font-bold"
                  >
                    {user.rol === "admin" ? "Ir al panel" : "Ir al panel (Mi Agenda)"}
                  </Link>
                )}

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
