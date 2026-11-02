import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmacionCitaPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pt-32 pb-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CalendarCheck className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-6 font-heading text-2xl font-bold">¡Cita confirmada!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Te enviaremos un recordatorio antes de tu cita. Puedes revisar o gestionar tus citas
        desde tu perfil.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
