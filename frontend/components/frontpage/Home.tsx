"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaWhatsapp,
  FaBoxOpen,
  FaShieldAlt,
  FaTruck,
  FaLayerGroup,
} from "react-icons/fa";

import { waLink, mediaUrl, formatPrice } from "@/lib/utils";
import {
  usePublicCategories,
  usePublicProducts,
  usePublicProductVariants,
} from "@/hooks/useInventory";

const WHY_US = [
  { tag: "01", title: "Durable by design", body: "Products selected for demanding working environments, not desk jobs." },
  { tag: "02", title: "Practical, not fussy", body: "We focus on products that solve real workplace problems without unnecessary complications." },
  { tag: "03", title: "One reliable source", body: "Workwear, PPE, cleaning, waste management and everyday industrial essentials in one place." },
] as const;

const MAX_CATEGORIES = 8;
const MAX_FEATURED = 8;

export default function Home() {
  const { categories, loading: categoriesLoading } = usePublicCategories();
  const { products, loading: productsLoading } = usePublicProducts();
  const {
    variants,
    loading: variantsLoading,
    lowestPriceFor,
  } = usePublicProductVariants();

  const visibleCategories = categories.slice(0, MAX_CATEGORIES);
  const featuredProducts = products
    .filter((p) => p.feature)
    .slice(0, MAX_FEATURED);

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
          SHOP BY CATEGORY
          Card layout: fixed-height visual block on top (image or
          fallback icon on an ink background with a hazard-stripe
          foot), separate bordered info panel below with title and
          a "Shop Now" link — matches the reference card shape.
      ========================================================= */}
      {(categoriesLoading || visibleCategories.length > 0) && (
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                  Shop by Category
                </div>

                <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Everything the job needs.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categoriesLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-ink/10 bg-paper">
                    <div className="h-[118px] animate-pulse bg-ink/5" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-pulse bg-ink/5" />
                      <div className="h-3 w-1/2 animate-pulse bg-ink/5" />
                    </div>
                  </div>
                ))}

              {!categoriesLoading &&
                visibleCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group flex flex-col border border-ink/10 bg-paper transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(21,20,15,0.12)]"
                  >
                    <div className="relative h-[118px] w-full overflow-hidden bg-ink">
                      {category.image ? (
                        <Image
                          src={mediaUrl(category.image)!}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-steel-light">
                          <FaLayerGroup size={28} />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-[16px] font-black leading-tight tracking-tight text-ink">
                        {category.name}
                      </h3>

                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-accent-dark group-hover:text-ink">
                        Shop Now
                        <FaArrowRight
                          size={9}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FEATURED PRODUCTS
          Card layout: square image block with an "In Stock" tag,
          separate bordered info panel below with name, description,
          price, and a "View Product" link — matches the reference
          product card shape.
      ========================================================= */}
      {(productsLoading || featuredProducts.length > 0) && (
        <section className="border-t border-ink/10 bg-paper px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                  Featured Products
                </div>

                <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Ready to move, ready to ship.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {productsLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-ink/10 bg-paper">
                    <div className="aspect-square animate-pulse bg-ink/5" />
                    <div className="space-y-2 p-3.5">
                      <div className="h-4 w-4/5 animate-pulse bg-ink/5" />
                      <div className="h-3 w-2/5 animate-pulse bg-ink/5" />
                    </div>
                  </div>
                ))}

              {!productsLoading &&
                featuredProducts.map((product) => {
                  const price = lowestPriceFor(product.id);

                  const inStock = variantsLoading
                    ? false
                    : variants.some(
                        (v) =>
                          v.product === product.id &&
                          v.is_active &&
                          v.quantity > 0
                      );

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group flex flex-col border border-ink/10 bg-paper transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(21,20,15,0.10)]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-ink-2">
                        {inStock && (
                          <span className="absolute left-2 top-2 z-10 bg-paper px-1.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] text-green">
                            In Stock
                          </span>
                        )}

                        {product.image ? (
                          <Image
                            src={mediaUrl(product.image)!}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-steel">
                            <FaBoxOpen size={22} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-3.5">
                        <h3 className="text-[13.5px] font-bold leading-snug text-ink line-clamp-2">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="mt-1 text-[11.5px] leading-relaxed text-steel line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <p className="mt-auto pt-2.5 font-mono text-[14.5px] font-bold text-ink">
                          {price !== null
                            ? formatPrice(price)
                            : "Enquire for pricing"}
                        </p>

                        <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-accent-dark group-hover:text-ink">
                          View Product
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
          </div>
        </section>
      )}

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