import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xiorizos | Salón Especialista en Rizos, Ondas y Afro - Valencia",
  description:
    "Salón y estudio en Naguanagua, Valencia especializado en cabello ondulado, rizado y afro. Diagnóstico capilar, cortes, color, terapias y productos.",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} font-sans bg-background font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed`}
      >
        {children}
      </body>
    </html>
  );
}
