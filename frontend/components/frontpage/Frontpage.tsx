"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

// ---------- Types ----------
type Category = {
  id: string;
  icon: string;
  name: string;
  items: string;
  desc: string;
};

type Product = {
  id: string;
  cat: string;
  icon: string;
  name: string;
  price: number;
  desc: string;
};

// ---------- Static content (not product data — swap for a CMS/backend later if needed) ----------
const CATEGORIES: Category[] = [
  { id: "workwear", icon: "🦍", name: "Workwear", items: "Overalls, Trousers, Shirts, Jackets", desc: "Professional workwear built for demanding environments." },
  { id: "ppe", icon: "🛡️", name: "PPE & Safety", items: "Helmets, Gloves, Shoes, Vests, Eye Protection", desc: "Certified personal protective equipment for every site." },
  { id: "waste", icon: "🗑️", name: "Waste Management", items: "Garbage Bags, Dustbins, Wheelie Bins, Recycling Bins", desc: "Waste handling equipment for sites, offices and homes." },
  { id: "cleaning", icon: "🧹", name: "Cleaning", items: "Mops, Brooms, Brushes, Buckets, Cloths", desc: "Everyday cleaning tools built to survive daily use." },
  { id: "consumables", icon: "🧤", name: "Consumables", items: "Disposable Gloves, Masks, Wipes, Shoe Covers", desc: "Single-use essentials for hygiene and site safety." },
  { id: "industrial", icon: "⚙️", name: "Industrial Supplies", items: "Cable Ties, Tapes, Workshop Supplies", desc: "General workshop and utility supplies for any job." },
  { id: "sitesafety", icon: "🚧", name: "Site Safety", items: "Cones, Warning Signs, Barrier Tape, First Aid", desc: "Signage and equipment to keep sites safe and compliant." },
  { id: "storage", icon: "📦", name: "Storage", items: "Toolboxes, Storage Bins, Crates, Shelving", desc: "Storage and organisation solutions for site, warehouse and workshop." },
];

const INDUSTRIES = [
  "Construction", "Automotive", "Solar & Electrical", "Manufacturing", "Agriculture",
  "Logistics", "Mining", "Oil & Gas", "Welding & Fabrication", "Utilities", "Marine & Ports", "Railway",
];

const WHATSAPP_NUMBER = "254700000000"; // E.164 without '+'
function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function fmt(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export default function HomePage() {
  const { addToCart } = useCart();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // TODO: replace with your real backend URL
    fetch("https://api.example.com/products?featured=true")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch featured products");
        return res.json();
      })
      .then((data: Product[]) => {
        if (!cancelled) setFeatured(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      {/* Hero / identity band */}
      <div className="bg-ink px-4 py-8 text-center text-paper">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          FUZIO <span className="text-accent">GORILLA</span>
        </h1>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel-light">
          Industrial Workwear &amp; Supplies
        </p>
      </div>

      {/* Categories */}
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
              01 — Catalogue
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="group flex min-w-0 flex-col border border-ink/10 bg-paper transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-[110px] items-center justify-center bg-ink text-4xl">
                  {c.icon}
                  <div className="absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-1.5 truncate text-base font-extrabold">{c.name}</h3>
                  <p className="mb-4 text-xs leading-relaxed text-steel">{c.items}</p>
                  <span className="mt-auto flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-accent-dark group-hover:text-ink">
                    Shop Now <FaArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
              02 — Featured
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Featured Products</h2>
          </div>

          {loading && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] w-full animate-pulse border border-ink/10 bg-paper" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-sm text-steel">
              Couldn&apos;t load featured products right now. Please try again shortly.
            </p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="flex min-w-0 flex-col border border-ink/10 bg-paper transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/product/${p.id}`} className="block">
                    <div className="relative flex aspect-square items-center justify-center bg-ink-2 text-3xl sm:text-4xl">
                      <span className="absolute left-2 top-2 bg-paper px-1.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-green">
                        In Stock
                      </span>
                      {p.icon}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-3.5">
                    <Link href={`/product/${p.id}`} className="mb-1 line-clamp-2 text-sm font-bold leading-snug">
                      {p.name}
                    </Link>
                    <p className="mb-2.5 line-clamp-2 text-[11px] leading-relaxed text-steel">{p.desc}</p>
                    <div className="mt-auto font-mono text-[15px] font-bold">{fmt(p.price)}</div>
                    <button
                      onClick={() =>
                        addToCart({ pid: p.id, name: p.name, price: p.price, icon: p.icon, size: null, color: null })
                      }
                      className="mt-2.5 w-full border-2 border-ink bg-ink py-2 text-[11px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why us */}
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
              03 — Why Us
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Why Fuzio Gorilla?</h2>
          </div>

          <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
            {[
              { tag: "BUILT TO LAST", title: "Durable by design", body: "Products selected for demanding working environments, not desk jobs." },
              { tag: "BUILT FOR THE JOB", title: "Practical, not fussy", body: "Designed around real workplace needs — nothing you don't actually use." },
              { tag: "ONE PLACE", title: "Workplace essentials", body: "From workwear and PPE to cleaning, waste management and supplies." },
            ].map((w) => (
              <div key={w.tag} className="bg-paper p-6">
                <div className="font-mono text-[11px] font-bold text-accent-dark">{w.tag}</div>
                <h4 className="mt-2.5 mb-2 text-base font-extrabold">{w.title}</h4>
                <p className="text-[13.5px] leading-relaxed text-steel">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-ink-2 px-4 py-8 text-paper sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              04 — Industries
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-paper sm:text-3xl">
              Workwear &amp; Safety For
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {INDUSTRIES.map((i) => (
              <span
                key={i}
                className="rounded-full border border-white/20 px-3.5 py-2 text-[12.5px] font-semibold text-steel-light"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent px-4 py-9 text-center text-ink sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="text-xl font-black sm:text-2xl">Prefer to order on WhatsApp?</h2>
          <p className="mt-2.5 mb-4 text-[13.5px] font-semibold">
            Send us your list and we&apos;ll confirm pricing and delivery in minutes.
          </p>
          <a
            href={waLink("Hello Fuzio Gorilla, I'd like to ask about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
          >
            <FaWhatsapp /> Order on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}