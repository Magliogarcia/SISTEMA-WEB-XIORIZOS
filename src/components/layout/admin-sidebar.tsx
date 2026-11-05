"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  ShoppingCart,
  Users,
  UserCheck,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/citas", label: "Citas Agendadas", icon: CalendarCheck },
  { href: "/admin/pedidos", label: "Pedidos y Pagos", icon: ShoppingCart },
  { href: "/admin/productos", label: "Productos / Catálogo", icon: Package },
  { href: "/admin/empleados", label: "Personal y Equipo", icon: UserCheck },
  { href: "/admin/usuarios", label: "Usuarios Registrados", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      {/* Logotipo Xiorizos Vertical Prominente */}
      <div className="flex flex-col items-center justify-center border-b border-slate-200 p-4 bg-slate-50/50">
        <Link href="/admin" className="flex flex-col items-center group">
          <div className="relative w-36 h-20 transition-transform group-hover:scale-105">
            <Image
              src="/images/Logo_completo_vertical.webp"
              alt="Logo Xiorizos"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary mt-1">
            Panel de Control
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 border-t border-slate-200 mt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ver tienda pública</span>
          </Link>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
