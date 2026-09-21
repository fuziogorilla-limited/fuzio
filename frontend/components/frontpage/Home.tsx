"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaWhatsapp,
  FaBoxOpen,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";

import { useHomeData } from "@/hooks/useHomeData";
import { waLink, mediaUrl, formatPrice } from "@/lib/utils";
import type { PublicCategory as Category, PublicProduct as Product } from "@/types/fields";

const WHY_US = [
  { tag: "01", title: "Durable by design", body: "Products selected for demanding working environments, not desk jobs." },
  { tag: "02", title: "Practical, not fussy", body: "We focus on products that solve real workplace problems without unnecessary complications." },
  { tag: "03", title: "One reliable source", body: "Workwear, PPE, cleaning, waste management and everyday industrial essentials in one place." },
] as const;

export default function Home() {
  const {
    categories,
    catLoading,
    catError,
    featured,
    prodLoading,
    prodError,
  } = useHomeData();

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      <section className="relative h-[calc(100dvh-72px)] w-full overflow-hidden bg-ink text-paper">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/ppe-optimized.mp4" type="video/mp4" />
        </video>

        {/* =======================================================
            OVERLAYS
        ======================================================= */}
        <div className="absolute inset-0 bg-ink/65" />

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

        {/* =======================================================
            HERO CONTENT
        ======================================================= */}
        <div className="relative z-10 flex h-full w-full items-end px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="max-w-4xl">
              {/* Brand label */}
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-accent" />

                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  Fuzio Gorilla
                </span>
              </div>

              {/* Main heading */}
              <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight md:text-5xl">
                Built for work.
                <br />
                <span className="text-accent">Ready when you are.</span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-steel-light sm:text-base">
                Workwear, PPE, cleaning supplies, waste management and
                industrial essentials for businesses across Kenya.
              </p>

              {/* Hero buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 bg-accent px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
                >
                  Shop Products

                  <FaArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href={waLink(
                    "Hello Fuzio Gorilla, I would like to enquire about your products."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-paper/80 px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                >
                  <FaWhatsapp />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INDUSTRIAL STRIPE
      ========================================================= */}
      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />

      {/* =========================================================
          VALUE PROPOSITIONS
      ========================================================= */}
      <section className="border-b border-ink/10 bg-paper">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-px bg-ink/10 sm:grid-cols-3">
          {/* Workplace essentials */}
          <div className="bg-paper p-6 sm:p-7">
            <div className="mb-5 flex h-9 w-9 items-center justify-center bg-accent text-ink">
              <FaBoxOpen size={15} />
            </div>

            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent-dark">
              Workplace essentials
            </div>

            <h3 className="mt-2 text-lg font-black tracking-tight">
              Built around real jobs
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-steel">
              Practical products selected for the environments where work
              actually happens.
            </p>
          </div>

          {/* Stock */}
          <div className="bg-paper p-6 sm:p-7">
            <div className="mb-5 flex h-9 w-9 items-center justify-center bg-accent text-ink">
              <FaShieldAlt size={15} />
            </div>

            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent-dark">
              Stock when possible
            </div>

            <h3 className="mt-2 text-lg font-black tracking-tight">
              Core products ready to move
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-steel">
              We focus on keeping commonly needed products available so you
              spend less time waiting.
            </p>
          </div>

          {/* Delivery */}
          <div className="bg-paper p-6 sm:p-7">
            <div className="mb-5 flex h-9 w-9 items-center justify-center bg-accent text-ink">
              <FaTruck size={15} />
            </div>

            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent-dark">
              Delivery across Kenya
            </div>

            <h3 className="mt-2 text-lg font-black tracking-tight">
              Nairobi + countrywide dispatch
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-steel">
              Get your order delivered in Nairobi or dispatched countrywide
              through trusted delivery partners.
            </p>
          </div>
        </div>
      </section>

{/* =========================================================
    CATEGORIES
========================================================= */}
<section className="bg-bg px-4 py-10 sm:px-6 sm:py-14">
  <div className="mx-auto max-w-[1240px]">
    {/* Section heading */}
    <div className="mb-7">
      <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
        01 — Catalogue
      </div>

      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        Shop by Category
      </h2>
    </div>

    {/* Category content */}
    {catLoading ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden border border-ink/10 bg-paper"
          >
            <div className="h-[118px] animate-pulse bg-ink-2" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 animate-pulse bg-ink/10" />
              <div className="h-10 w-full animate-pulse bg-ink/10" />
              <div className="h-4 w-24 animate-pulse bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    ) : catError ? (
      <div className="border border-ink/10 bg-paper p-8 text-center">
        <p className="text-sm font-semibold text-steel">
          Categories are currently unavailable.
        </p>
      </div>
    ) : categories.length === 0 ? (
      <div className="border border-ink/10 bg-paper p-8 text-center">
        <p className="text-sm font-semibold text-steel">
          No categories available right now.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category: Category) => {
          const image = mediaUrl(category.image);

          return (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group flex min-h-[260px] flex-col overflow-hidden border border-ink/10 bg-paper text-left transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(21,20,15,0.12)]"
            >
              {/* Category visual */}
              <div className="relative flex h-[118px] items-center justify-center overflow-hidden bg-ink-2">
                {image ? (
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <FaBoxOpen
                    size={40}
                    className="text-paper/80"
                  />
                )}

                {/* Dark overlay when image exists */}
                {image && (
                  <div className="absolute inset-0 bg-ink/25" />
                )}

                {/* Hazard stripe */}
                <div className="absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />
              </div>

              {/* Category body */}
              <div className="flex flex-1 flex-col p-4 pb-[18px] sm:p-[16px_18px_18px]">
                <h3 className="text-[16px] font-extrabold tracking-tight text-ink">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="mt-1.5 mb-4 line-clamp-3 text-[12px] leading-[1.5] text-steel">
                    {category.description}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-1.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-accent-dark transition-colors group-hover:text-ink">
                  Shop Now
                  <FaArrowRight
                    size={9}
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )}
  </div>
</section>

     {/* =========================================================
    FEATURED PRODUCTS
========================================================= */}
<section className="bg-bg px-4 py-10 sm:px-6 sm:py-14">
  <div className="mx-auto max-w-[1240px]">
    {/* Section heading */}
    <div className="mb-7">
      <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
        02 — Featured
      </div>

      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        Featured Products
      </h2>
    </div>

    {/* Product content */}
    {prodLoading ? (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden border border-ink/10 bg-paper"
          >
            <div className="aspect-square animate-pulse bg-ink-2" />

            <div className="space-y-3 p-4">
              <div className="h-4 w-full animate-pulse bg-ink/10" />
              <div className="h-8 w-full animate-pulse bg-ink/10" />
              <div className="h-5 w-24 animate-pulse bg-ink/10" />
              <div className="h-9 w-full animate-pulse bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    ) : prodError ? (
      <div className="border border-ink/10 bg-paper p-8 text-center">
        <p className="text-sm font-semibold text-steel">
          Featured products are currently unavailable.
        </p>
      </div>
    ) : featured.length === 0 ? (
      <div className="border border-ink/10 bg-paper p-8 text-center">
        <p className="text-sm font-semibold text-steel">
          No featured products available right now.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {featured.map((product: Product) => {
          const image = mediaUrl(product.image);

          return (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden border border-ink/10 bg-paper transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_10px_22px_rgba(21,20,15,0.10)]"
            >
              {/* Product visual */}
              <Link
                href={`/product/${product.id}`}
                className="relative aspect-square overflow-hidden bg-ink-2"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 700px) 50vw, (max-width: 980px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaBoxOpen
                      size={42}
                      className="text-paper/70"
                    />
                  </div>
                )}

                {/* Stock badge */}
                <div className="absolute left-2 top-2 bg-paper px-2 py-[3px] font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] text-green">
                  In Stock
                </div>
              </Link>

              {/* Product body */}
              <div className="flex flex-1 flex-col p-[13px_14px_15px]">
                <Link href={`/product/${product.id}`}>
                  <h3 className="line-clamp-2 text-[13.5px] font-bold leading-[1.35] text-ink transition-colors group-hover:text-accent-dark">
                    {product.name}
                  </h3>
                </Link>

                {product.description && (
                  <p className="mt-1.5 mb-2.5 line-clamp-3 text-[11.5px] leading-[1.5] text-steel">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <div className="mt-auto font-mono text-[14.5px] font-bold text-ink">
                  {formatPrice(product.selling_price)}
                </div>

                {/* Add to cart */}
                <Link
                  href={`/product/${product.id}`}
                  className="mt-2.5 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-3.5 py-[9px] text-[11px] font-bold uppercase tracking-wide text-paper transition-all duration-150 hover:-translate-y-[1px] hover:border-accent hover:bg-accent hover:text-ink"
                >
                  View Product
                  <FaArrowRight size={9} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</section>

      {/* =========================================================
          WHY FUZIO GORILLA
      ========================================================= */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            {/* Heading */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                Why Fuzio Gorilla
              </div>

              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Supply that keeps work moving.
              </h2>
            </div>

            {/* Reasons */}
            <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
              {WHY_US.map((item) => (
                <div key={item.tag} className="bg-paper p-6">
                  <div className="font-mono text-[11px] font-bold tracking-[0.12em] text-accent-dark">
                    {item.tag}
                  </div>

                  <h3 className="mt-5 text-[16px] font-black tracking-tight text-ink">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-relaxed text-steel">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-accent px-4 py-12 text-center text-ink sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink/60">
            Ready when you are
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Need supplies for your next job?
          </h2>

          <p className="mx-auto mb-6 mt-2.5 max-w-xl text-[13.5px] font-semibold leading-relaxed">
            Browse our products or speak directly with us about what you need.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Shop Products

              <FaArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href={waLink(
                "Hello Fuzio Gorilla, I need supplies for my next job."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              <FaWhatsapp />
              Talk to Us
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          INDUSTRIAL STRIPE
      ========================================================= */}
      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />
    </main>
  );
}