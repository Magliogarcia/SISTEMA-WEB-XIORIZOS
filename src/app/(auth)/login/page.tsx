"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [cargando, setCargando] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    const formData = new FormData(e.currentTarget);

    // Login simulado. En la fase de backend se reemplazará por la llamada real a la API.
    setTimeout(() => {
      login({
        id: "u-demo",
        nombre: "Cliente Demo",
        email: String(formData.get("email")),
        rol: "cliente",
      });
      router.push("/");
    }, 800);
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-2xl font-bold">Iniciar sesión</h1>
      <p className="mb-6 text-sm text-muted-foreground">Bienvenida de nuevo a Xiorizos</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" required placeholder="tucorreo@ejemplo.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
