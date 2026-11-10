"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsuariosPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return null;
}
