import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaTruck } from "react-icons/fa";

// Bundled locally — swap for a fetch to your backend if categories become dynamic.
const FOOTER_CATEGORIES = [
  { id: "workwear", name: "Workwear" },
  { id: "ppe", name: "PPE & Safety" },
  { id: "waste", name: "Waste Management" },
  { id: "cleaning", name: "Cleaning" },
  { id: "storage", name: "Storage" },
];

const WHATSAPP_NUMBER = "254798982870";
const WHATSAPP_MESSAGE = "Hello Fuzio Gorilla, I'd like to ask about your products.";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Footer() {
  return (
    <footer className="w-full overflow-x-hidden bg-ink text-steel-light pt-11 pb-5">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-y-8 gap-x-6 mb-8 sm:gap-x-8 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 min-w-0 md:col-span-1">
            <h5 className="font-mono text-xs tracking-[0.1em] uppercase text-paper mb-3.5">
              Fuzio Gorilla
            </h5>
            <p className="max-w-[220px] break-words text-[13px] leading-relaxed mb-2">
              Industrial workwear &amp; supplies. Fuzio Gorilla Industries Ltd. Kenya.
            </p>
            <p className="text-[13px] leading-relaxed">Mon–Sat, 8:00–18:00 EAT</p>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h5 className="font-mono text-xs tracking-[0.1em] uppercase text-paper mb-3.5">
              Quick Links
            </h5>
            <nav className="flex flex-col gap-2.5 text-[13px]">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/shop" className="hover:text-accent transition-colors">
                Shop
              </Link>
              <Link href="/about" className="hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-accent transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="min-w-0">
            <h5 className="font-mono text-xs tracking-[0.1em] uppercase text-paper mb-3.5">
              Categories
            </h5>
            <nav className="flex flex-col gap-2.5 text-[13px]">
              {FOOTER_CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="truncate hover:text-accent transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="min-w-0">
            <h5 className="font-mono text-xs tracking-[0.1em] uppercase text-paper mb-3.5">
              Support
            </h5>
            <nav className="flex flex-col gap-2.5 text-[13px]">
              <a
                href={waLink(WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <FaWhatsapp className="shrink-0" /> WhatsApp
              </a>
              <a
                href="tel:+254798982870"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <FaPhoneAlt className="shrink-0 text-[11px]" /> +254 798 982 870
              </a>
              <a
                href="mailto:orders@fuziogorilla.co.ke"
                className="flex items-center gap-2 break-all hover:text-accent transition-colors"
              >
                <FaEnvelope className="shrink-0" /> orders@fuziogorilla.co.ke
              </a>
              <Link
                href="/delivery-returns"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <FaTruck className="shrink-0" /> Delivery &amp; Returns
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2.5 border-t border-white/10 pt-[18px] text-[11.5px] text-steel">
          <span>© {new Date().getFullYear()} Fuzio Gorilla Industries Ltd. All rights reserved.</span>
          <span>Terms · Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}