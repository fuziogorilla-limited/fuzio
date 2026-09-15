"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaWhatsapp, FaBoxOpen, FaThLarge } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

// ---------- Types (mirroring the Django serializers) ----------
type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
};

type Product = {
  id: number;
  category: number;
  name: string;
  description: string;
  selling_price: string; // DRF DecimalField serializes as a string
  color: string;
  size: string;
  is_active: boolean;
  feature: boolean;
};

const INDUSTRIES = [
  "Construction", "Automotive", "Solar & Electrical", "Manufacturing", "Agriculture",
  "Logistics", "Mining", "Oil & Gas", "Welding & Fabrication", "Utilities", "Marine & Ports", "Railway",
];

const WHATSAPP_NUMBER = "254700000000"; // E.164 without '+'
function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function fmt(price: string) {
  return "KES " + Number(price).toLocaleString("en-KE");
}
function mediaUrl(path: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}

export default function HomePage() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [featured, setFeatured] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Category[]>(routes.inventory.publicCategories)
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setCatError(true);
      })
      .finally(() => {
        if (!cancelled) setCatLoading(false);
      });

    apiFetch<Product[]>(routes.inventory.publicProducts)
      .then((data) => {
        if (cancelled) return;
        setFeatured(data.filter((p) => p.feature && p.is_active).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setProdError(true);
      })
      .finally(() => {
        if (!cancelled) setProdLoading(false);
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
              Catalogue
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Shop by Category</h2>
          </div>

          {catLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[220px] w-full animate-pulse border border-ink/10 bg-paper" />
              ))}
            </div>
          )}

          {!catLoading && catError && (
            <p className="text-sm text-steel">Couldn&apos;t load categories right now. Please try again shortly.</p>
          )}

          {!catLoading && !catError && categories.length === 0 && (
            <p className="text-sm text-steel">No categories available yet.</p>
          )}

          {!catLoading && !catError && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c) => {
                const img = mediaUrl(c.image);
                return (
                  <Link
                    key={c.id}
                    href={`/category/${c.id}`}
                    className="group flex min-w-0 flex-col border border-ink/10 bg-paper transition-transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative flex h-[110px] items-center justify-center overflow-hidden bg-ink">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        <FaThLarge className="text-4xl text-steel-light" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-1.5 truncate text-base font-extrabold">{c.name}</h3>
                      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-steel">{c.description}</p>
                      <span className="mt-auto flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-accent-dark group-hover:text-ink">
                        Shop Now <FaArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
              Featured
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Featured Products</h2>
          </div>

          {prodLoading && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] w-full animate-pulse border border-ink/10 bg-paper" />
              ))}
            </div>
          )}

          {!prodLoading && prodError && (
            <p className="text-sm text-steel">
              Couldn&apos;t load featured products right now. Please try again shortly.
            </p>
          )}

          {!prodLoading && !prodError && featured.length === 0 && (
            <p className="text-sm text-steel">No featured products yet.</p>
          )}

          {!prodLoading && !prodError && featured.length > 0 && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="flex min-w-0 flex-col border border-ink/10 bg-paper transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/product/${p.id}`} className="block">
                    <div className="flex aspect-square items-center justify-center bg-ink-2">
                      <FaBoxOpen className="text-3xl text-steel-light sm:text-4xl" />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-3.5">
                    <Link href={`/product/${p.id}`} className="mb-1 line-clamp-2 text-sm font-bold leading-snug">
                      {p.name}
                    </Link>
                    <p className="mb-2.5 line-clamp-2 text-[11px] leading-relaxed text-steel">{p.description}</p>
                    <div className="mt-auto font-mono text-[15px] font-bold">{fmt(p.selling_price)}</div>
                    <button
                      onClick={() =>
                        addToCart({
                          pid: String(p.id),
                          name: p.name,
                          price: Number(p.selling_price),
                          size: p.size || null,
                          color: p.color || null,
                        })
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
              Why Us
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Why Fuzio Gorilla?</h2>
          </div>

          <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
            {[
              { tag: "BUILT TO LAST", title: "Durable by design", body: "Products selected for demanding working environments, not desk jobs." },
              { tag: "BUILT FOR THE JOB", title: "Practical, not fussy", body: "Designed around real workplace needs, nothing you don't actually use." },
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