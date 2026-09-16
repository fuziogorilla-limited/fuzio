"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { NAV_LINKS } from "@/constants/navigation";
import { waLink } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const { cartCount, openCart } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const runSearch = (term: string) => {
    const q = term.trim();

    router.push(
      q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"
    );

    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-3 px-4 py-3.5 sm:gap-5 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center border-2 border-paper bg-accent text-[15px] font-extrabold tracking-tight text-ink">
            FG
          </div>

          <div className="min-w-0 leading-none">
            <div className="truncate text-[15px] font-extrabold tracking-wide sm:text-[16px]">
              FUZIO GORILLA
            </div>

            <div className="mt-[3px] hidden font-mono text-[9px] tracking-[0.13em] text-accent sm:block">
              TOUGHER THAN THE JOB
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="ml-2 hidden shrink-0 gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent py-1.5 text-[13px] font-semibold tracking-wide opacity-85 transition-colors hover:border-accent hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden min-w-0 max-w-[360px] flex-1 items-center gap-2 rounded-sm border border-white/15 bg-ink-2 px-3 lg:flex">
          <FaSearch className="shrink-0 text-[13px] opacity-60" />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                runSearch(query);
              }
            }}
            placeholder="What are you looking for?"
            className="w-full min-w-0 bg-transparent px-2 py-2.5 text-[13px] text-paper outline-none placeholder:text-steel-light"
          />
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3.5">
          {/* Mobile menu */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm border border-white/20 transition-colors hover:border-accent lg:hidden"
          >
            {mobileOpen ? (
              <FaTimes size={16} />
            ) : (
              <FaBars size={16} />
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Cart"
            onClick={openCart}
            className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm border border-white/20 transition-colors hover:border-accent"
          >
            <FaShoppingCart size={16} />

            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-[3px] font-mono text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </button>

          {/* WhatsApp */}
          <a
            href={waLink(
              "Hello Fuzio Gorilla, I'd like to ask about your products."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-2 rounded-sm bg-green px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530] sm:flex"
          >
            <FaWhatsapp />
            Chat
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="w-full overflow-x-hidden border-t border-white/10 bg-ink-2 px-4 py-5 sm:px-6 lg:hidden">
          {/* Mobile search */}
          <div className="mb-5 flex min-w-0 items-center gap-2 rounded-sm border border-white/15 bg-ink px-3">
            <FaSearch className="shrink-0 text-[13px] opacity-60" />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  runSearch(query);
                }
              }}
              placeholder="What are you looking for?"
              className="w-full min-w-0 bg-transparent px-2 py-2.5 text-[13px] text-paper outline-none placeholder:text-steel-light"
            />
          </div>

          {/* Mobile navigation */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/5 py-2.5 text-[14px] font-semibold last:border-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}