// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaBoxOpen,
  FaShieldAlt,
  FaTruck,
  FaLayerGroup,
  FaClipboardCheck,
  FaTools,
  FaProjectDiagram,
  FaWhatsapp,
} from "react-icons/fa";

import { mediaUrl, formatPrice } from "@/lib/utils";
import {
  usePublicCategories,
  usePublicProducts,
  usePublicProductVariants,
} from "@/hooks/useInventory";
import { PILLARS, WA } from "../content";
import {
  Stripe,
  SectionLabel,
  CtaLink,
  CtaBand,
  IndustryTags,
  ChipList,
} from "@/components/shared";

/* -------------------------------------------------------------------------- */
/*  Copy                                                                      */
/* -------------------------------------------------------------------------- */

const HERO_TRUST = [
  "Supply",
  "Installation",
  "Project Support",
  "Delivery across Kenya",
] as const;

// Shown only while the backend has no categories, so the section never renders empty.
const FALLBACK_CATEGORIES = [
  { name: "Packaging & Warehouse", description: "Stretch film, tape, cartons, strapping and labels." },
  { name: "Cleaning & Janitorial", description: "Chemicals, mops, brushes, cloths and bin liners." },
  { name: "Maintenance & Workshop", description: "Adhesives, abrasives, lubricants and fasteners." },
  { name: "Workwear & PPE", description: "Overalls, gloves, safety footwear and helmets." },
] as const;

const SOLUTION_STEPS = [
  { tag: "01", title: "Supply", body: "Equipment, materials and consumables from established suppliers." },
  { tag: "02", title: "Install", body: "Setup and implementation for applicable equipment and systems." },
  { tag: "03", title: "Support", body: "Product selection, technical help and project coordination." },
] as const;

const WHY_US = [
  { icon: FaLayerGroup, title: "One source", body: "Energy, machinery and supplies in one place." },
  { icon: FaClipboardCheck, title: "Practical selection", body: "Suitability, specifications and value." },
  { icon: FaTools, title: "Technical capability", body: "Help with equipment and system selection." },
  { icon: FaProjectDiagram, title: "Project ready", body: "From a single item to a full project." },
  { icon: FaShieldAlt, title: "Business focused", body: "Correct specs, quantities and quality." },
  { icon: FaTruck, title: "Nationwide delivery", body: "Serving customers across Kenya." },
] as const;

const MAX_CATEGORIES = 4;
const MAX_FEATURED = 8;
const CHIPS_PER_PILLAR = 4;

/* -------------------------------------------------------------------------- */
/*  Local pieces                                                              */
/* -------------------------------------------------------------------------- */

function ArrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-accent-dark group-hover:text-ink">
      {children}
      <FaArrowRight
        size={9}
        className="transition-transform group-hover:translate-x-1"
      />
    </span>
  );
}

/** Label + heading (+ optional "view all" link) used by every section. */
function SectionHeader({
  label,
  title,
  href,
  linkText,
}: {
  label: string;
  title: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>

      {href && linkText && (
        <Link href={href} className="group">
          <ArrowLabel>{linkText}</ArrowLabel>
        </Link>
      )}
    </div>
  );
}

function CategoryCard({
  href,
  name,
  description,
  image,
}: {
  href: string;
  name: string;
  description?: string | null;
  image?: string | null;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-ink/10 bg-bg transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(21,20,15,0.12)]"
    >
      <div className="relative flex h-[110px] w-full items-center justify-center overflow-hidden bg-ink text-steel-light">
        {image ? (
          <Image
            src={mediaUrl(image)!}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FaLayerGroup size={28} />
        )}

        <div className="absolute inset-x-0 bottom-0">
          <Stripe size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[16px] font-black leading-tight tracking-tight text-ink">
          {name}
        </h3>

        {description && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-steel line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <ArrowLabel>Shop Now</ArrowLabel>
        </div>
      </div>
    </Link>
  );
}

function ProductCard({
  id,
  name,
  image,
  price,
  inStock,
}: {
  id: number | string;
  name: string;
  image?: string | null;
  price: number | null;
  inStock: boolean;
}) {
  return (
    <Link
      href={`/product/${id}`}
      className="group flex flex-col border border-ink/10 bg-paper transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(21,20,15,0.10)]"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-2">
        {inStock && (
          <span className="absolute left-2 top-2 z-10 bg-paper px-1.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] text-green">
            In Stock
          </span>
        )}

        {image ? (
          <Image
            src={mediaUrl(image)!}
            alt={name}
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
          {name}
        </h3>

        <p className="mt-auto pt-2.5 font-mono text-[14.5px] font-bold text-ink">
          {price !== null ? formatPrice(price) : "Enquire for pricing"}
        </p>

        <div className="mt-2.5">
          <ArrowLabel>View Product</ArrowLabel>
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

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
                <SectionLabel tone="light">
                  Energy • Machinery • Industrial Supplies
                </SectionLabel>
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-5xl">
                Keep your business
                <br />
                <span className="text-accent">moving.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-steel-light sm:text-base">
                Products, equipment and practical solutions for businesses
                across Kenya.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <CtaLink href="/all-products">Shop Products</CtaLink>
                <CtaLink href={WA.quote} variant="outlineLight" arrow={false}>
                  Request a Quote
                </CtaLink>
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

      <Stripe />

      {/* =========================================================
          WHAT WE DO
      ========================================================= */}
      <section id="services" className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeader
            label="What we do"
            title="Energy. Machinery. Industrial supplies."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.id}
                  id={pillar.id}
                  className="flex flex-col border border-ink/10 bg-paper p-6"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center bg-accent text-ink">
                    <Icon size={17} />
                  </div>

                  <h3 className="text-xl font-black uppercase leading-tight tracking-tight text-ink">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-steel">
                    {pillar.summary}
                  </p>

                  <div className="mt-4">
                    <ChipList items={pillar.items.slice(0, CHIPS_PER_PILLAR)} />
                  </div>

                  <Link
                    href={pillar.href}
                    className="group mt-auto pt-5"
                  >
                    <ArrowLabel>{pillar.cta}</ArrowLabel>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORIES
      ========================================================= */}
      <section
        id="categories"
        className="border-t border-ink/10 bg-paper px-4 py-14 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1240px]">
          <SectionHeader
            label="Categories"
            title="Shop by category."
            href="/all-products"
            linkText="Shop all"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-bg">
                  <div className="h-[110px] animate-pulse bg-ink/5" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 animate-pulse bg-ink/5" />
                    <div className="h-3 w-full animate-pulse bg-ink/5" />
                  </div>
                </div>
              ))}

            {!categoriesLoading &&
              visibleCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  href={`/category/${category.id}`}
                  name={category.name}
                  description={category.description}
                  image={category.image}
                />
              ))}

            {useFallbackCategories &&
              FALLBACK_CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.name}
                  href="/all-products"
                  name={category.name}
                  description={category.description}
                />
              ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================= */}
      {(productsLoading || featuredProducts.length > 0) && (
        <section
          id="featured"
          className="border-t border-ink/10 px-4 py-14 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-[1240px]">
            <SectionHeader
              label="Featured products"
              title="Popular supplies, ready to order."
              href="/all-products"
              linkText="View all"
            />

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
                featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    price={lowestPriceFor(product.id)}
                    inStock={
                      !variantsLoading &&
                      variants.some(
                        (v) =>
                          v.product === product.id &&
                          v.is_active &&
                          v.quantity > 0
                      )
                    }
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FROM PRODUCT TO SOLUTION
      ========================================================= */}
      <section className="bg-ink px-4 py-14 text-paper sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <SectionLabel tone="light">From product to solution</SectionLabel>

              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Supply. Install.
                <br />
                <span className="text-accent">Support.</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-steel-light sm:text-base">
                Sometimes you need a product. Sometimes you need equipment
                installed and running. We support you from selection through
                implementation.
              </p>

              <div className="mt-7">
                <CtaLink href={WA.team}>Talk to Our Team</CtaLink>
              </div>
            </div>

            <ol className="grid gap-px bg-paper/10">
              {SOLUTION_STEPS.map((step) => (
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

      <Stripe />

      {/* =========================================================
          WHY FUZIO GORILLA
      ========================================================= */}
      <section className="bg-paper px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeader
            label="Why Fuzio Gorilla"
            title="Solutions that keep work moving."
          />

          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="bg-paper p-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center bg-accent text-ink">
                    <Icon size={15} />
                  </div>
                  <h3 className="text-[15px] font-black uppercase leading-tight tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-steel">
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
          <SectionHeader
            label="Industries"
            title="Built for the way Kenyan businesses work."
          />

          <IndustryTags homeOnly />

          <div className="mt-8">
            <CtaLink href={WA.team} variant="ink">
              Talk to Our Team
            </CtaLink>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROJECT CTA
      ========================================================= */}
      <CtaBand
        eyebrow="Have a project?"
        title="Start with the requirement."
        body="Tell us what you need, the quantity or specification, and where it's going. We'll help find the right products and support the installation."
      >
        <CtaLink href={WA.quote} variant="inkOnAccent">
          Request a Quote
        </CtaLink>
        <CtaLink
          href={WA.general}
          variant="outlineInk"
          arrow={false}
          icon={<FaWhatsapp />}
        >
          WhatsApp Us
        </CtaLink>
      </CtaBand>

      <Stripe />
    </main>
  );
}