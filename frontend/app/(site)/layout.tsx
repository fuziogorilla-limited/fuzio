import CartDrawer from "@/components/frontpage/CartDrawer";
import Footer from "@/components/frontpage/Footer";
import Header from "@/components/frontpage/Header";
import { CartProvider } from "@/context/CartContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />
      <CartDrawer/>
    </CartProvider>
  );
}