"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaWhatsapp,
  FaBoxOpen,
  FaThLarge,
  FaTruck,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

// ============================================================
// TYPES
// ============================================================

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
  selling_price: string;
  color: string;
  size: string;
  is_active: boolean;
  feature: boolean;
};

// ============================================================
// DATA
// ============================================================

const WHY_US = [
  {
    tag: "01",
    title: "Durable by design",
    body: "Products selected for demanding working environments, not desk jobs.",
  },
  {
    tag: "02",
    title: "Practical, not fussy",
    body: "We focus on products that solve real workplace problems without unnecessary complications.",
  },
  {
    tag: "03",
    title: "One reliable source",
    body: "Workwear, PPE, cleaning, waste management and everyday industrial essentials in one place.",
  },
];

const WHATSAPP_NUMBER = "254798982870";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

function fmt(price: string) {
  return "KES " + Number(price).toLocaleString("en-KE");
}

function mediaUrl(path: string | null) {
  if (!path) return null;

  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}

// ============================================================
// PAGE
// ============================================================

export default function HomePage() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [featured, setFeatured] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState(false);

  // ==========================================================
  // FETCH DATA
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    apiFetch<Category[]>(routes.inventory.publicCategories)
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCatLoading(false);
        }
      });

    apiFetch<Product[]>(routes.inventory.publicProducts)
      .then((data) => {
        if (cancelled) return;

        setFeatured(
          data.filter((p) => p.feature && p.is_active).slice(0, 4)
        );
      })
      .catch(() => {
        if (!cancelled) {
          setProdError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setProdLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="w-full overflow-x-hidden bg-bg">

      {/* ======================================================
          HERO — FULL SCREEN VIDEO
      ====================================================== */}

      <section className="relative min-h-screen overflow-hidden bg-ink text-paper">

        {/* Background Video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/ppe-optimized.mp4" type="video/mp4" />
        </video>

        {/* Main dark overlay */}
        <div className="absolute inset-0 bg-ink/55" />

        {/* Left-side readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1240px] items-center px-4 py-24 sm:px-6">

          <div className="max-w-4xl">

            {/* Brand */}
            <div className="flex items-center gap-3">

              <span className="h-[2px] w-8 bg-accent" />

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Fuzio Gorilla
              </span>

            </div>

            {/* Headline */}
            <h1 className="mt-6 text-[58px] font-black uppercase leading-[0.84] tracking-[-0.06em] text-4xl md:text-6xl ">
              Built for
              <br />
              <span className="text-accent">work</span>
            </h1>

            {/* Small category line */}
            <div className="mt-7 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">
              PPE&nbsp;&nbsp;•&nbsp;&nbsp;Workwear&nbsp;&nbsp;•&nbsp;&nbsp;Industrial
              Supplies
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-ink transition-all hover:bg-paper"
              >
                Shop Products

                <FaArrowRight
                  size={10}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href={waLink(
                  "Hello Fuzio Gorilla, I'd like to enquire about your products."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-white/30 bg-ink/30 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-paper backdrop-blur-sm transition-all hover:border-accent hover:bg-accent hover:text-ink"
              >
                <FaWhatsapp size={14} />
                WhatsApp
              </a>

            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 right-5 z-20 hidden items-center gap-3 sm:flex">

          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
            Explore
          </span>

          <span className="h-10 w-px bg-white/30" />

        </div>

        {/* Industrial stripe */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />

      </section>

      {/* ======================================================
          VALUE PROPOSITIONS
      ====================================================== */}

      <section className="border-b border-ink/10 bg-paper">

        <div className="mx-auto grid max-w-[1240px] divide-y divide-ink/10 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">

          {/* Workplace essentials */}
          <div className="flex items-center gap-4 py-7 md:px-7 md:py-8 md:first:pl-0">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-ink">
              <FaBoxOpen size={17} />
            </div>

            <div>
              <div className="text-[12px] font-extrabold uppercase tracking-tight">
                Workplace essentials
              </div>

              <div className="mt-1 text-[11px] text-steel">
                Built around real jobs
              </div>
            </div>

          </div>

          {/* Stock */}
          <div className="flex items-center gap-4 py-7 md:px-7 md:py-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-ink">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <path d="M3 9l9-5 9 5" />
                <path d="M5 10v9h14v-9" />
                <path d="M9 19v-5h6v5" />
              </svg>
            </div>

            <div>
              <div className="text-[12px] font-extrabold uppercase tracking-tight">
                Stock when possible
              </div>

              <div className="mt-1 text-[11px] text-steel">
                Core products ready to move
              </div>
            </div>

          </div>

          {/* Delivery */}
          <div className="flex items-center gap-4 py-7 md:px-7 md:py-8 md:last:pr-0">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-ink">
              <FaTruck size={17} />
            </div>

            <div>
              <div className="text-[12px] font-extrabold uppercase tracking-tight">
                Delivery across Kenya
              </div>

              <div className="mt-1 text-[11px] text-steel">
                Nairobi + countrywide dispatch
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          CATEGORIES
      ====================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-20">

        <div className="mx-auto max-w-[1240px]">

          <div className="mb-9 grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end">

            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                Catalogue
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Shop by category.
              </h2>
            </div>

            <div className="lg:justify-self-end">

              <p className="max-w-md text-[13.5px] leading-relaxed text-steel">
                Find the everyday equipment, workwear and site essentials
                needed to keep your operation moving.
              </p>
            </div>

          </div>

          {/* Loading */}
          {catLoading && (
            <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">

              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] animate-pulse bg-paper"
                />
              ))}

            </div>
          )}

          {/* Error */}
          {!catLoading && catError && (
            <div className="border border-ink/10 bg-paper p-6 text-sm text-steel">
              Couldn&apos;t load categories right now. Please try again
              shortly.
            </div>
          )}

          {/* Empty */}
          {!catLoading && !catError && categories.length === 0 && (
            <div className="border border-ink/10 bg-paper p-6 text-sm text-steel">
              No categories available yet.
            </div>
          )}

          {/* Categories */}
          {!catLoading && !catError && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">

              {categories.map((category) => {

                const img = mediaUrl(category.image);

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group flex min-w-0 flex-col bg-paper transition-colors hover:bg-ink"
                  >

                    <div className="relative h-[155px] overflow-hidden bg-ink-2">

                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={category.name}
                          className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FaThLarge className="text-4xl text-steel-light" />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />

                      <div className="absolute left-4 top-4 font-mono text-[10px] font-bold text-accent">
                        CATEGORY
                      </div>

                    </div>

                    <div className="flex flex-1 flex-col p-5">

                      <h3 className="line-clamp-1 text-[15px] font-extrabold transition-colors group-hover:text-paper">
                        {category.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-steel transition-colors group-hover:text-steel-light">
                        {category.description}
                      </p>

                      <span className="mt-6 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wide text-accent-dark transition-colors group-hover:text-accent">
                        Shop Category

                        <FaArrowRight
                          size={9}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>

                    </div>

                  </Link>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* ======================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="bg-ink-2 px-4 py-14 text-paper sm:px-6 sm:py-20">

        <div className="mx-auto max-w-[1240px]">

          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Featured
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Ready for the job.
              </h2>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 self-start font-mono text-[11px] font-bold uppercase tracking-wide text-accent sm:self-auto"
            >
              Browse All Products

              <FaArrowRight
                size={10}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

          {prodLoading && (
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">

              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[0.82] animate-pulse bg-ink"
                />
              ))}

            </div>
          )}

          {!prodLoading && prodError && (
            <div className="border border-white/10 bg-ink p-6 text-sm text-steel-light">
              Couldn&apos;t load featured products right now. Please try again
              shortly.
            </div>
          )}

          {!prodLoading && !prodError && featured.length === 0 && (
            <div className="border border-white/10 bg-ink p-6 text-sm text-steel-light">
              No featured products yet.
            </div>
          )}

          {!prodLoading && !prodError && featured.length > 0 && (
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">

              {featured.map((product) => (

                <div
                  key={product.id}
                  className="group flex min-w-0 flex-col bg-ink"
                >

                  <Link
                    href={`/product/${product.id}`}
                    className="block"
                  >

                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-ink-2">

                      <FaBoxOpen className="text-4xl text-steel transition-transform duration-300 group-hover:scale-110 sm:text-5xl" />

                    </div>

                  </Link>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">

                    <Link
                      href={`/product/${product.id}`}
                      className="line-clamp-2 text-[13px] font-bold leading-snug text-paper transition-colors hover:text-accent sm:text-sm"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-steel-light">
                      {product.description}
                    </p>

                    <div className="mt-4 font-mono text-[14px] font-bold text-accent sm:text-[15px]">
                      {fmt(product.selling_price)}
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          pid: String(product.id),
                          name: product.name,
                          price: Number(product.selling_price),
                          size: product.size || null,
                          color: product.color || null,
                        })
                      }
                      className="mt-3 w-full border-2 border-white/15 bg-transparent py-2.5 text-[10px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
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

      {/* ======================================================
          WHY FUZZIO GORILLA
      ====================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-20">

        <div className="mx-auto max-w-[1240px]">

          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">

            <div>

              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                Why Fuzio Gorilla
              </div>

              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                No fluff.
                <br />
                Just what the job needs.
              </h2>

              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-steel">
                We believe buying workplace supplies should be straightforward.
                Good products, clear communication and dependable delivery.
              </p>

              <Link
                href="/about"
                className="group mt-6 inline-flex items-center gap-2 border-b-2 border-ink pb-2 font-mono text-[10px] font-bold uppercase tracking-wide text-ink"
              >
                Our Story

                <FaArrowRight
                  size={9}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>

            <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">

              {WHY_US.map((item) => (

                <div
                  key={item.tag}
                  className="group bg-paper p-6 transition-colors hover:bg-accent"
                >

                  <div className="font-mono text-[11px] font-bold text-accent-dark">
                    {item.tag}
                  </div>

                  <h3 className="mt-8 text-[15px] font-extrabold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-relaxed text-steel">
                    {item.body}
                  </p>

                  <div className="mt-7 h-px w-8 bg-accent" />

                </div>

              ))}

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-accent px-4 py-14 text-ink sm:px-6 sm:py-16">

        <div className="mx-auto max-w-[1240px]">

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">
                Get Moving
              </div>

              <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Need supplies for the next job?
              </h2>

              <p className="mt-3 max-w-xl text-[13.5px] font-semibold leading-relaxed">
                Browse the catalogue or send us your list. We&apos;ll help
                confirm availability, pricing and delivery.
              </p>

            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Shop Products

                <FaArrowRight
                  size={10}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href={waLink(
                  "Hello Fuzio Gorilla, I'd like to get a quote."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-ink px-6 py-3.5 text-[12px] font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
              >
                <FaWhatsapp size={14} />
                Get a Quote
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          INDUSTRIAL FOOTER STRIPE
      ====================================================== */}

      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />

    </main>
  );
}