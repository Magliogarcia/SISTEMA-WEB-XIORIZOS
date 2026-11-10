import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-on-surface overflow-x-clip">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
