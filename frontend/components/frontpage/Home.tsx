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
import { WHY_US } from "@/constants/home";
import { waLink, mediaUrl, formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/types/home";

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
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          {/* Section heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                Shop by Category
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Essentials for the job.
              </h2>
            </div>

            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-ink"
            >
              View all categories

              <FaArrowRight
                size={10}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Category content */}
          {catLoading ? (
            <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse bg-steel/10"
                />
              ))}
            </div>
          ) : catError ? (
            <div className="border border-ink/10 p-8 text-center">
              <p className="text-sm font-semibold text-steel">
                Categories are currently unavailable.
              </p>
            </div>
          ) : (
            <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((category: Category) => {
                const image = mediaUrl(category.image);

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group relative min-h-56 overflow-hidden bg-ink"
                  >
                    {/* Category image */}
                    {image && (
                      <Image
                        src={image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Category overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                    {/* Category information */}
                    <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                      <h3 className="text-lg font-black">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="mt-1 line-clamp-2 text-[12px] text-steel-light">
                          {category.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                        Explore
                        <FaArrowRight size={9} />
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
      <section className="bg-ink-2 px-4 py-14 text-paper sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          {/* Section heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Featured Products
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Ready for the job.
              </h2>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-paper"
            >
              View all products

              <FaArrowRight
                size={10}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Product content */}
          {prodLoading ? (
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse bg-white/5"
                />
              ))}
            </div>
          ) : prodError ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-sm font-semibold text-steel-light">
                Featured products are currently unavailable.
              </p>
            </div>
          ) : featured.length === 0 ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-sm font-semibold text-steel-light">
                No featured products available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product: Product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-ink-2"
                >
                  {/* Product image */}
                  <div className="relative aspect-square overflow-hidden bg-paper">
                    <div className="absolute inset-0 flex items-center justify-center text-ink/20">
                      <FaBoxOpen size={50} />
                    </div>
                  </div>

                  {/* Product information */}
                  <div className="p-5">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                      Featured
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold text-paper">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-sm font-black text-accent">
                      {formatPrice(product.selling_price)}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-steel-light transition-colors group-hover:text-accent">
                      View product

                      <FaArrowRight
                        size={9}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              ))}
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