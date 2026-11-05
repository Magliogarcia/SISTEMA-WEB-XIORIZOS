"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { filterNameInput, validateFullName, validateEmail } from "@/lib/validation";

export default function RegistroPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [cargando, setCargando] = useState(false);

  const [nombre, setNombre] = useState("");
  const [nombreError, setNombreError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let hasErrors = false;

    const rNombre = validateFullName(nombre);
    if (!rNombre.isValid) {
      setNombreError(rNombre.error || "Nombre no válido");
      hasErrors = true;
    } else {
      setNombreError(null);
    }

    const rEmail = validateEmail(email);
    if (!rEmail.isValid) {
      setEmailError(rEmail.error || "Correo no válido");
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    if (hasErrors) return;

    setCargando(true);

    setTimeout(() => {
      login({
        id: "u-demo",
        nombre: rNombre.formatted || nombre,
        email: rEmail.formatted || email,
        rol: "cliente",
      });
      router.push("/");
    }, 800);
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-2xl font-bold">Crear cuenta</h1>
      <p className="mb-6 text-sm text-muted-foreground">Únete a la comunidad Xiorizos</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            required
            value={nombre}
            onChange={(e) => {
              setNombre(filterNameInput(e.target.value));
              if (nombreError) setNombreError(null);
            }}
            placeholder="Ej. Sofía Marín"
            className={nombreError ? "border-destructive" : ""}
          />
          {nombreError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {nombreError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            placeholder="tucorreo@ejemplo.com"
            className={emailError ? "border-destructive" : ""}
          />
          {emailError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {emailError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="••••••••"
            className={passwordError ? "border-destructive" : ""}
          />
          {passwordError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {passwordError}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
