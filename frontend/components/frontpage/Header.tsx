// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { usePublicCategories, usePublicProducts } from "@/hooks/useInventory";
import CartDrawer from "./CartDrawer";
import SearchBar from "../SearchBar";
import { waLink } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const { itemCount, openCart } = useCart();

  // Fetched once here and shared by the desktop and mobile search bars.
  const { products, loading: productsLoading } = usePublicProducts();
  const { categories } = usePublicCategories();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] w-full bg-black text-paper">
        {/* MAIN HEADER */}
        <div className="mx-auto flex h-full w-full max-w-[1240px] items-center gap-3 px-4 sm:gap-5 sm:px-6">
          {/* Logo (public/logo.svg) */}
          <Link
            href="/"
            aria-label="Fuzio Gorilla home"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/logo.svg"
              alt="Fuzio Gorilla"
              width={180}
              height={48}
              priority
              unoptimized
              className="h-10 w-auto sm:h-12"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
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

          {/* DESKTOP SEARCH */}
          <div className="hidden min-w-0 max-w-[360px] flex-1 lg:block">
            <SearchBar
              products={products}
              categories={categories}
              loading={productsLoading}
            />
          </div>

          {/* ACTIONS */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3.5">
            {/* Cart */}
            <button
              type="button"
              aria-label="Cart"
              onClick={openCart}
              className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm border border-white/20 transition-colors hover:border-accent"
            >
              <FaShoppingCart size={16} />

              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-[3px] font-mono text-[10px] font-bold text-ink">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm border border-white/20 transition-colors hover:border-accent lg:hidden"
            >
              {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
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

        {/* MOBILE MENU
            Absolutely positioned so it does NOT change the 72px header height. */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-[72px] w-full border-t border-white/10 bg-ink-2 px-4 py-5 shadow-2xl sm:px-6 lg:hidden">
            <div className="mb-5">
              <SearchBar
                products={products}
                categories={categories}
                loading={productsLoading}
                inputClassName="bg-ink"
                onNavigate={() => setMobileOpen(false)}
              />
            </div>

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

      {/* Rendered once here so every page can open it via useCart().openCart() */}
      <CartDrawer />
    </>
  );
}