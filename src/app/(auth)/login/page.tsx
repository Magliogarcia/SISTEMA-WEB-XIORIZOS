"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
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
        setError(data.error || "Credenciales incorrectas. Verifica tus datos.");
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
      setError("Error de conexión con el servidor.");
      setCargando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Título y subtítulo con letras sólidas y legibles */}
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-sm font-semibold text-slate-600">
          Ingresa a tu cuenta o accede como administrador del salón
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-md bg-rose-50 p-3.5 text-xs font-bold text-rose-800 border border-rose-300 shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {isAuthenticated && user && (
        <div className="rounded-md border border-amber-300 bg-amber-50/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#855230] text-white font-black text-xs">
                {user.nombre.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.nombre}</p>
                <p className="text-xs font-semibold text-slate-600">{user.email}</p>
              </div>
            </div>
            <span className="font-black text-xs uppercase px-2 py-0.5 rounded bg-[#855230] text-white">
              {user.rol}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
            {user.rol === "admin" && (
              <Button
                type="button"
                size="sm"
                className="flex-1 text-xs font-bold bg-[#855230] hover:bg-[#6e4123] text-white rounded-md shadow-sm"
                onClick={() => router.push("/admin")}
              >
                Ir al Panel Admin
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-bold rounded-md border-amber-300 text-slate-800 bg-white hover:bg-amber-100"
              onClick={() => logout()}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-xs font-bold text-slate-800">
            Usuario o Correo Electrónico
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-800/60" />
            <Input
              id="identifier"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ej. admin o tu@correo.com"
              className="pl-10 text-sm font-semibold rounded-md border-amber-200 bg-amber-50/20 focus:border-[#855230] focus:ring-[#855230] placeholder:text-slate-400 placeholder:font-normal h-11"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-bold text-slate-800">
              Contraseña
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-800/60" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 text-sm font-semibold rounded-md border-amber-200 bg-amber-50/20 focus:border-[#855230] focus:ring-[#855230] placeholder:text-slate-400 placeholder:font-normal h-11"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-bold bg-gradient-to-r from-[#855230] via-[#9B5C32] to-[#B86835] hover:from-[#724222] hover:to-[#88471F] text-white rounded-md text-sm py-2.5 shadow-md transition-all flex items-center justify-center gap-2 h-11 cursor-pointer"
          disabled={cargando}
        >
          <span>{cargando ? "Comprobando..." : "Iniciar Sesión"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="pt-2 border-t border-slate-100 text-center">
        <p className="text-xs font-semibold text-slate-600">
          ¿No tienes una cuenta aún?{" "}
          <Link href="/registro" className="font-bold text-[#855230] hover:text-[#5c351b] underline underline-offset-2">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-slate-600">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
