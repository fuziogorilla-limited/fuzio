"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "254798982870"; // E.164 without '+'
const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Header() {
  const router = useRouter();
  const { cartCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const runSearch = (term: string) => {
    const q = term.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-3 px-4 py-3.5 sm:gap-5 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center border-2 border-paper bg-accent text-ink font-extrabold text-[15px] tracking-tight">
            FG
          </div>
          <div className="min-w-0 leading-none">
            <div className="truncate font-extrabold text-[15px] tracking-wide sm:text-[16px]">
              FUZIO GORILLA
            </div>
            <div className="hidden font-mono text-[9px] tracking-[0.13em] text-accent mt-[3px] sm:block">
              TOUGHER THAN THE JOB
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex shrink-0 gap-6 ml-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-semibold tracking-wide opacity-85 hover:opacity-100 border-b-2 border-transparent hover:border-accent py-1.5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden lg:flex min-w-0 flex-1 max-w-[360px] items-center gap-2 rounded-sm border border-white/15 bg-ink-2 px-3">
          <FaSearch className="shrink-0 opacity-60 text-[13px]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
            placeholder="What are you looking for?"
            className="w-full min-w-0 bg-transparent py-2.5 px-2 text-[13px] text-paper placeholder:text-steel-light outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2.5 ml-auto sm:gap-3.5">
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex lg:hidden h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm border border-white/20 hover:border-accent transition-colors"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>

          <button
            aria-label="Cart"
            onClick={openCart}
            className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm border border-white/20 hover:border-accent transition-colors"
          >
            <FaShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-[3px] font-mono text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href={waLink("Hello Fuzio Gorilla, I'd like to ask about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex shrink-0 items-center gap-2 rounded-sm bg-green px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#245530] transition-colors"
          >
            <FaWhatsapp /> Chat
          </a>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden w-full overflow-x-hidden border-t border-white/10 bg-ink-2 px-4 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 rounded-sm border border-white/15 bg-ink px-3 mb-5">
            <FaSearch className="shrink-0 opacity-60 text-[13px]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
              placeholder="What are you looking for?"
              className="w-full min-w-0 bg-transparent py-2.5 px-2 text-[13px] text-paper placeholder:text-steel-light outline-none"
            />
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-[14px] font-semibold border-b border-white/5 last:border-none"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}