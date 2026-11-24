"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Lock,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  CalendarCheck,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { login, logout, user, isAuthenticated } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Credenciales incorrectas.");
        setCargando(false);
        return;
      }

      login(data.user);

      if (data.user.rol === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al servidor.");
      setCargando(false);
    }
  }

  // SI EL USUARIO YA TIENE UNA SESIÓN INICIADA: Mostrar tarjeta elegante de cuenta activa
  if (isAuthenticated && user) {
    const esAdmin = user.rol === "admin";
    const esPersonal = user.rol === "empleado" || user.rol === "estilista";
    const iniciales = user.nombre
      ? user.nombre
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "XR";

    return (
      <div className="space-y-6 font-sans">
        {/* Cabecera de bienvenida personalizada */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#6E3D21] to-[#855230] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
            {iniciales}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              ¡Hola, {user.nombre}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tu sesión está actualmente iniciada y activa.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF6F2] text-[#855230] border border-[#E8DCD1]">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {esAdmin ? "Administrador" : esPersonal ? "Especialista" : "Cliente Xiorizos"}
            </span>
          </div>
        </div>

        {/* Acciones principales directas */}
        <div className="space-y-2.5 pt-2">
          {esAdmin && (
            <Button
              type="button"
              className="w-full bg-slate-950 hover:bg-black text-white font-semibold text-xs py-2.5 shadow-md flex items-center justify-center gap-2 rounded-xl"
              onClick={() => router.push("/admin")}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Ir al Panel de Administración</span>
              <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          )}

          {esPersonal && (
            <Button
              type="button"
              className="w-full bg-slate-950 hover:bg-black text-white font-semibold text-xs py-2.5 shadow-md flex items-center justify-center gap-2 rounded-xl"
              onClick={() => router.push("/admin/citas")}
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Ver Mis Citas Asignadas</span>
              <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          )}

          <Button
            type="button"
            className="w-full bg-gradient-to-r from-[#6E3D21] to-[#855230] hover:from-[#5C3016] hover:to-[#734323] text-white font-semibold text-xs py-2.5 shadow-md shadow-[#6E3D21]/20 flex items-center justify-center gap-2 rounded-xl transition-all"
            onClick={() => router.push("/citas")}
          >
            <Sparkles className="h-4 w-4" />
            <span>Agendar una Nueva Cita</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl"
            onClick={() => router.push("/catalogo")}
          >
            <ShoppingBag className="h-4 w-4 text-secondary" />
            <span>Ver Catálogo de Productos</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Button>
        </div>

        {/* Botón de cerrar sesión para entrar con otra cuenta */}
        <div className="pt-4 border-t border-slate-200 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={() => logout()}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            <span>Cerrar sesión / Iniciar con otra cuenta</span>
          </Button>
        </div>
      </div>
    );
  }

  // SI NO HAY SESIÓN: Mostrar el formulario limpio, moderno y elegante
  return (
    <div className="space-y-5 font-sans">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Iniciar sesión</h1>
        <p className="mt-1 text-xs text-slate-500">
          Ingresa tus credenciales para acceder a tus citas y pedidos.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-xs font-semibold text-slate-700">
            Usuario o Correo electrónico
          </Label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="identifier"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ej. usuario o tu@correo.com"
              className="pl-10 text-xs rounded-xl border-slate-200 h-10 focus-visible:ring-secondary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Contraseña
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10 text-xs rounded-xl border-slate-200 h-10 focus-visible:ring-secondary"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 focus:outline-none transition-colors"
              title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {mostrarPassword ? (
                <EyeOff className="h-4 w-4 text-secondary" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-semibold bg-gradient-to-r from-[#6E3D21] to-[#855230] hover:from-[#5C3016] hover:to-[#734323] text-white rounded-xl text-xs py-3 shadow-md shadow-[#6E3D21]/20 transition-all cursor-pointer h-10"
          disabled={cargando}
        >
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500">
        ¿No tienes una cuenta aún?{" "}
        <Link href="/registro" className="font-semibold text-secondary hover:underline">
          Crear cuenta nueva
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
