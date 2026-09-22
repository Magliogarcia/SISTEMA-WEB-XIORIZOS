"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, User as UserIcon, Scissors, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { CartSheet } from "@/components/shop/cart-sheet";

const navLinks = [
  { href: "/catalogo", label: "Tienda" },
  { href: "/citas", label: "Agendar cita" },
  { href: "/simulador", label: "Simulador de color" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const openCart = useCartStore((state) => state.openCart);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight">Xiorizos</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemsCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                {itemsCount}
              </Badge>
            )}
          </Button>

          <Link href={isAuthenticated ? "/perfil" : "/login"}>
            <Button variant="ghost" size="icon" aria-label="Cuenta">
              <UserIcon className="h-5 w-5" />
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Scissors className="h-5 w-5 text-primary" />
                  Xiorizos
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {link.label === "Simulador de color" && <Palette className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-border" />
                {isAuthenticated ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Hola, {user?.nombre}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CartSheet />
    </header>
  );
}
