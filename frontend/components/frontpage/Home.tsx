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
  FaSearch,
} from "react-icons/fa";

import { waLink, mediaUrl, formatPrice } from "@/lib/utils";
import {
  usePublicCategories,
  usePublicProducts,
  usePublicProductVariants,
} from "@/hooks/useInventory";

/* -------------------------------------------------------------------------- */
/*  Copy                                                                      */
/* -------------------------------------------------------------------------- */

// There's no quote form yet, so "Request a Quote" opens WhatsApp with a
// prefilled message. Swap this for a /quote page link when one exists.
const QUOTE_LINK = waLink(
  "Hello Fuzio Gorilla, I would like to request a quote.\n\nProducts needed:\nQuantity:\nDelivery location:"
);

const HERO_TRUST = [
  "Bulk orders",
  "Business procurement",
  "Delivery across Kenya",
] as const;

// Shown only if the backend has no categories yet, so the page never renders
// an empty section. Once categories exist in the admin, those take over (and
// their description comes from the Category.description field).
const FALLBACK_CATEGORIES = [
  {
    name: "Packaging & Warehouse",
    description:
      "Stretch film, packaging tape, cartons, strapping, labels and packing supplies.",
  },
  {
    name: "Cleaning & Janitorial",
    description:
      "Cleaning chemicals, mops, brooms, brushes, cloths, garbage bags and bin liners.",
  },
  {
    name: "Maintenance & Workshop",
    description:
      "Adhesives, tapes, abrasives, lubricants, fasteners and workshop consumables.",
  },
  {
    name: "Workwear & PPE",
    description:
      "Overalls, gloves, safety footwear, helmets, reflective wear and protective equipment.",
  },
  {
    name: "Electrical & Solar",
    description:
      "Cable ties, connectors, cable management products and electrical installation accessories.",
  },
  {
    name: "Waste Management",
    description:
      "Garbage bags, bin liners, dustbins, wheelie bins and waste-handling products.",
  },
  {
    name: "Office & Workplace",
    description:
      "Stationery, washroom supplies, labels, printing supplies and everyday workplace essentials.",
  },
  {
    name: "Site & Facility",
    description:
      "Safety signage, barriers, cleaning equipment, storage and facility supplies.",
  },
] as const;

const PROCUREMENT_STEPS = [
  {
    tag: "01",
    title: "Source",
    body: "Find the products you need through our supplier network.",
  },
  {
    tag: "02",
    title: "Quote",
    body: "Receive a clear quotation based on your requirements and quantities.",
  },
  {
    tag: "03",
    title: "Supply",
    body: "We arrange the supply and delivery to keep your operations moving.",
  },
] as const;

const WHY_US = [
  {
    icon: FaLayerGroup,
    title: "One source",
    body: "Reduce the hassle of dealing with multiple suppliers for everyday business supplies.",
  },
  {
    icon: FaShieldAlt,
    title: "Business-ready",
    body: "We understand that businesses need the right products, quantities and documentation — not just a shopping experience.",
  },
  {
    icon: FaBoxOpen,
    title: "Bulk & recurring supply",
    body: "From one-off purchases to regular business requirements, we can support your supply needs.",
  },
  {
    icon: FaSearch,
    title: "Sourcing support",
    body: "If you don't see what you need in our catalogue, ask us. We can source it.",
  },
  {
    icon: FaTruck,
    title: "Delivery across Kenya",
    body: "Get your supplies where your business needs them.",
  },
] as const;

const INDUSTRIES = [
  "Construction",
  "Manufacturing",
  "Logistics & Warehousing",
  "Solar & Electrical",
  "Automotive",
  "Hospitality",
  "Agriculture",
  "Offices & Facilities",
] as const;

const MAX_CATEGORIES = 8;
const MAX_FEATURED = 8;

/* -------------------------------------------------------------------------- */
/*  Small shared pieces                                                       */
/* -------------------------------------------------------------------------- */

function SectionLabel({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
        light ? "text-accent" : "text-accent-dark"
      }`}
    >
      {children}
    </div>
  );
}

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

  const useFallbackCategories =
    !categoriesLoading && visibleCategories.length === 0;

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[calc(100dvh-72px)] w-full overflow-hidden bg-ink text-paper">
        {/* Decorative image — the heading carries the message.
            `priority` because it's the largest above-the-fold element. */}
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-ink/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

        <div className="relative z-10 flex min-h-[calc(100dvh-72px)] w-full items-end px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="max-w-4xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-accent" />

                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  Fuzio Gorilla
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight md:text-5xl">
                Keep your business
                <br />
                <span className="text-accent">moving.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base font-bold leading-snug text-paper sm:text-lg">
                Industrial supplies. Workplace essentials. One reliable
                source.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel-light sm:text-base">
                From packaging and cleaning supplies to PPE, maintenance
                consumables and electrical essentials. Fuzio Gorilla helps
                businesses across Kenya get the supplies they need, when
                they need them.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/all-products"
                  className="group inline-flex items-center gap-2 bg-accent px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
                >
                  Shop Products
                  <FaArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href={QUOTE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-paper/80 px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                >
                  Request a Quote
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-steel-light">
                {HERO_TRUST.map((item, i) => (
                  <li key={item} className="flex items-center gap-4">
                    {i > 0 && (
                      <span aria-hidden className="text-accent">
                        •
                      </span>
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />

      {/* =========================================================
          CATEGORIES
      ========================================================= */}
      <section id="categories" className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8">
            <SectionLabel>Categories</SectionLabel>

            <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Everything your business needs.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-paper">
                  <div className="h-[118px] animate-pulse bg-ink/5" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 animate-pulse bg-ink/5" />
                    <div className="h-3 w-full animate-pulse bg-ink/5" />
                    <div className="h-3 w-2/3 animate-pulse bg-ink/5" />
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

                    {category.description && (
                      <p className="mt-2 text-[12.5px] leading-relaxed text-steel line-clamp-3">
                        {category.description}
                      </p>
                    )}

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

            {useFallbackCategories &&
              FALLBACK_CATEGORIES.map((category) => (
                <Link
                  key={category.name}
                  href="/all-products"
                  className="group flex flex-col border border-ink/10 bg-paper transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(21,20,15,0.12)]"
                >
                  <div className="relative flex h-[118px] w-full items-center justify-center overflow-hidden bg-ink text-steel-light">
                    <FaLayerGroup size={28} />

                    <div className="absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[16px] font-black leading-tight tracking-tight text-ink">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-[12.5px] leading-relaxed text-steel">
                      {category.description}
                    </p>

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

          <div className="mt-8 flex flex-wrap gap-3">
            {/* <Link
              href="/all-products"
              className="group inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Explore All Categories
              <FaArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link> */}

            <Link
              href="/all-products"
              className="group inline-flex items-center gap-2 bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink"
            >
              Shop All Products
              <FaArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================= */}
      {(productsLoading || featuredProducts.length > 0) && (
        <section className="border-t border-ink/10 bg-paper px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-8">
              <SectionLabel>Featured Products</SectionLabel>

              <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Popular supplies, ready to order.
              </h2>
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
          PROCUREMENT PARTNER
      ========================================================= */}
      <section className="bg-ink px-4 py-14 text-paper sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <SectionLabel light>Find it. Source it. Deliver it.</SectionLabel>

              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                More than a supplier.
                <br />
                <span className="text-accent">Your procurement partner.</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-steel-light sm:text-base">
                Can&apos;t find what you&apos;re looking for? Send us your
                product requirements, whether it&apos;s one item, a
                recurring supply, or a complete procurement list. We&apos;ll
                help you:
              </p>

              <a
                href={QUOTE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex items-center gap-2 bg-accent px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
              >
                Request a Quote
                <FaArrowRight
                  size={11}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>

            <ol className="grid gap-px bg-paper/10">
              {PROCUREMENT_STEPS.map((step) => (
                <li key={step.tag} className="flex gap-5 bg-ink p-6">
                  <span className="font-mono text-[13px] font-bold tracking-[0.1em] text-accent">
                    {step.tag}
                  </span>

                  <div>
                    <h3 className="text-[16px] font-black uppercase tracking-tight">
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-[13px] leading-relaxed text-steel-light">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />

      {/* =========================================================
          WHY BUSINESSES CHOOSE FUZIO GORILLA
      ========================================================= */}
      <section className="bg-paper px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8">
            <SectionLabel>Why businesses choose Fuzio Gorilla</SectionLabel>

            <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Supply that keeps work moving.
            </h2>
          </div>

          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  // Last card spans the row on the 2-column layout so there's
                  // no empty grey cell beside it.
                  className={`bg-paper p-6 ${
                    i === WHY_US.length - 1
                      ? "sm:col-span-2 lg:col-span-1"
                      : ""
                  }`}
                >
                  <div className="mb-5 flex h-9 w-9 items-center justify-center bg-accent text-ink">
                    <Icon size={15} />
                  </div>

                  <h3 className="text-[15px] font-black uppercase leading-tight tracking-tight text-ink">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[13px] leading-relaxed text-steel">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          INDUSTRIES
      ========================================================= */}
      <section className="border-t border-ink/10 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8">
            <SectionLabel>Industries</SectionLabel>

            <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Built for the way Kenyan businesses work.
            </h2>

            <p className="mt-3 text-sm text-steel sm:text-base">
              We supply businesses across multiple sectors.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {INDUSTRIES.map((industry) => (
              <li
                key={industry}
                className="border-2 border-ink/15 bg-paper px-4 py-2.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink"
              >
                {industry}
              </li>
            ))}
          </ul>

          <a
            href={waLink(
              "Hello Fuzio Gorilla, I'd like to talk to your team about supplying my business."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink"
          >
            Talk to Our Team
            <FaArrowRight
              size={11}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-accent px-4 py-12 text-center text-ink sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink/60">
            Don&apos;t see what you need?
          </div>

          <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
            Send us your procurement list.
          </h2>

          <p className="mx-auto mb-6 mt-2.5 max-w-xl text-[13.5px] font-semibold leading-relaxed">
            You don&apos;t need to search through hundreds of products. Simply
            tell us what you need, the quantity and where you need it
            delivered. We&apos;ll help you source and quote it.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={QUOTE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Request a Quote
              <FaArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href={waLink(
                "Hello Fuzio Gorilla, I need supplies for my business."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              <FaWhatsapp />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />
    </main>
  );
}