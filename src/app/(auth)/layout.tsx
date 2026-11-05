import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4 py-8">
      <Link href="/" className="mb-6 block transition-transform hover:scale-105">
        <Image
          src="/images/Logo_completo_horizontal.webp"
          alt="Xiorizos"
          width={180}
          height={48}
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>
      <div className="w-full max-w-sm rounded-md border border-slate-200 bg-white p-7 shadow-sm">
        {children}
      </div>
    </div>
  );
}
