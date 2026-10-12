// components/shared.tsx
// Reusable building blocks for Home, About and Contact.

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import { INDUSTRIES } from "./content";

/* -------------------------------------------------------------------------- */
/*  Stripe divider                                                            */
/* -------------------------------------------------------------------------- */

export function Stripe({ size = "lg" }: { size?: "sm" | "lg" }) {
  return size === "lg" ? (
    <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />
  ) : (
    <div className="h-[5px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_8px,var(--color-ink)_8px_16px)]" />
  );
}

/* -------------------------------------------------------------------------- */
/*  Labels                                                                    */
/* -------------------------------------------------------------------------- */

export function SectionLabel({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  /** dark = on light backgrounds, light = on ink backgrounds, ink = on accent */
  tone?: "dark" | "light" | "ink";
}) {
  const color = {
    dark: "text-accent-dark",
    light: "text-accent",
    ink: "text-ink/60",
  }[tone];

  return (
    <div
      className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${color}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTA link (internal or external, with arrow)                               */
/* -------------------------------------------------------------------------- */

const CTA_VARIANTS = {
  accent: "bg-accent text-ink hover:bg-paper",
  ink: "bg-ink text-paper hover:bg-accent hover:text-ink",
  inkOnAccent:
    "border-2 border-ink bg-ink text-paper hover:bg-paper hover:text-ink",
  outlineLight:
    "border-2 border-paper/80 text-paper hover:border-accent hover:bg-accent hover:text-ink",
  outlineInk: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
} as const;

export function CtaLink({
  href,
  variant = "accent",
  icon,
  arrow = true,
  children,
}: {
  href: string;
  variant?: keyof typeof CTA_VARIANTS;
  icon?: React.ReactNode;
  arrow?: boolean;
  children: React.ReactNode;
}) {
  const className = `group inline-flex items-center gap-2 px-6 py-3 text-[13px] font-bold uppercase tracking-wide transition-colors ${CTA_VARIANTS[variant]}`;

  const content = (
    <>
      {icon}
      {children}
      {arrow && (
        <FaArrowRight
          size={11}
          className="transition-transform group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page hero (About, Contact)                                                */
/* -------------------------------------------------------------------------- */

export function PageHero({
  label,
  title,
  intro,
  asideLabel,
  aside,
}: {
  label: string;
  title: React.ReactNode;
  intro: string;
  asideLabel: string;
  aside: string;
}) {
  return (
    <section className="bg-ink px-4 py-10 text-paper sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <SectionLabel tone="light">{label}</SectionLabel>

            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-steel-light sm:text-[15px]">
              {intro}
            </p>
          </div>

          <div className="border-l border-white/15 pl-5 lg:pb-1">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              {asideLabel}
            </div>

            <p className="mt-2 text-[13px] leading-relaxed text-steel-light">
              {aside}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Accent call-to-action band                                                */
/* -------------------------------------------------------------------------- */

export function CtaBand({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-accent px-4 py-12 text-center text-ink sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1240px]">
        <SectionLabel tone="ink">{eyebrow}</SectionLabel>

        <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mx-auto mb-6 mt-2.5 max-w-xl text-[13.5px] font-semibold leading-relaxed">
          {body}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Industries                                                                */
/* -------------------------------------------------------------------------- */

export function IndustryTags({ homeOnly = false }: { homeOnly?: boolean }) {
  const list = homeOnly ? INDUSTRIES.filter((i) => i.home) : INDUSTRIES;

  return (
    <ul className="flex flex-wrap content-start gap-2.5">
      {list.map((industry) => (
        <li
          key={industry.name}
          className="border-2 border-ink/15 bg-paper px-4 py-2.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink"
        >
          {industry.name}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chips (pillar item lists)                                                 */
/* -------------------------------------------------------------------------- */

export function ChipList({
  items,
  dark = false,
}: {
  items: readonly string[];
  dark?: boolean;
}) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={`px-2 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.05em] ${
            dark ? "bg-paper/10 text-steel-light" : "bg-ink/5 text-steel"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}