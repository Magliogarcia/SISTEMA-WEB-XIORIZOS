"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center pt-32">
      <p className="text-sm text-muted-foreground">Redirigiendo a tu cuenta...</p>
    </div>
  );
}

