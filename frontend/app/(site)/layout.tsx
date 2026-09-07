import { CartProvider } from "@/context/CartContext";
import Header from "@/components/frontpage/Header";
import Footer from "@/components/frontpage/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />
    </CartProvider>
  );
}