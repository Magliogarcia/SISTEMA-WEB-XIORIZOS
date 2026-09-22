import Link from "next/link";
import { Scissors } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Scissors className="h-7 w-7 text-primary" />
        <span className="font-heading text-2xl font-bold">Xiorizos</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
