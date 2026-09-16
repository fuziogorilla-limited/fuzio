import Link from "next/link";
import { FaArrowRight, FaCheck, FaWhatsapp } from "react-icons/fa";

import { BRAND_VALUES, INDUSTRIES, PROCESS, STORY_STEPS } from "@/constants/about";
import { waLink } from "@/lib/utils";

export default function About() {
  return (
    <main className="w-full overflow-x-hidden bg-bg">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="bg-ink px-4 py-10 text-paper sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                About Fuzio Gorilla
              </div>

              <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                Built for the people
                <br />
                who keep things moving.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-steel-light sm:text-[15px]">
                We supply the workwear, PPE, industrial consumables and site
                essentials that keep Kenya&apos;s hardest-working industries
                moving.
              </p>
            </div>

            <div className="border-l border-white/15 pl-5 lg:pb-1">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                Our approach
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-steel-light">
                Practical products. Reliable supply. Straightforward service.
                No unnecessary complications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                Our Story
              </div>

              <h2 className="mt-3 max-w-sm text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                We saw a problem worth fixing.
              </h2>
            </div>

            <div className="max-w-3xl lg:pt-1">
              <p className="text-xl font-bold leading-relaxed tracking-tight text-ink sm:text-2xl">
                Getting basic industrial supplies shouldn&apos;t become a
                project of its own.
              </p>

              <p className="mt-5 text-[15px] leading-relaxed text-steel">
                Fuzio Gorilla started with a simple frustration: workshops,
                construction sites, factories and farms were spending too much
                time chasing down the products they needed to get work done.
              </p>
            </div>
          </div>

          {/* Story timeline */}
          <div className="mt-14 border-t border-ink/10">
            <div className="grid divide-y divide-ink/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {STORY_STEPS.map((step, index) => (
                <div
                  key={step.label}
                  className={[
                    "relative px-0 py-7 lg:py-9",
                    index === 0 ? "lg:pl-0 lg:pr-8" : "lg:px-8",
                    index === STORY_STEPS.length - 1 ? "lg:pr-0" : "",
                  ].join(" ")}
                >
                  <div className="font-mono text-[11px] font-bold tracking-[0.12em] text-accent-dark">
                    {step.label}
                  </div>

                  <h3 className="mt-3 text-lg font-extrabold tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-[13.5px] leading-relaxed text-steel">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What we believe */}
          <div className="mt-10 grid gap-0 border border-ink/10 lg:grid-cols-[1fr_1.5fr]">
            <div className="bg-ink p-7 text-paper sm:p-9">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                What we believe
              </div>

              <h3 className="mt-3 text-2xl font-black leading-tight">
                The job comes first.
              </h3>
            </div>

            <div className="p-7 sm:p-9">
              <p className="max-w-2xl text-[15px] font-semibold leading-relaxed text-ink">
                Our job is not to make buying supplies complicated. It is to
                make sure you get the right products, at a fair price, when you
                actually need them.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {BRAND_VALUES.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[12px] font-bold text-steel"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-accent text-ink">
                      <FaCheck size={9} />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW WE WORK
      ========================================================= */}
      <section className="bg-ink-2 px-4 py-14 text-paper sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-9 grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                How We Work
              </div>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-[28px]">
                From supplier to site.
              </h2>
            </div>

            <p className="max-w-lg text-[13px] leading-relaxed text-steel-light lg:justify-self-end">
              We keep the process simple: source the right products, keep
              important items available, confirm your order and get it moving.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group bg-ink-2 p-6 transition-colors hover:bg-ink"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      size={17}
                      className="text-accent transition-transform group-hover:scale-110"
                    />
                  </div>

                  <h4 className="mb-2 mt-8 text-[15px] font-extrabold text-paper">
                    {step.title}
                  </h4>

                  <p className="text-[13px] leading-relaxed text-steel-light">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          INDUSTRIES WE SERVE
      ========================================================= */}
      <section className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                Industries We Serve
              </div>

              <h2 className="mt-2 max-w-md text-2xl font-extrabold tracking-tight sm:text-[28px]">
                Stocked for the work you do.
              </h2>

              <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-steel">
                From construction sites to workshops, farms and industrial
                facilities, we supply businesses that need equipment to work
                as hard as they do.
              </p>
            </div>

            <div className="flex flex-wrap content-start gap-2.5 lg:pt-1">
              {INDUSTRIES.map((industry) => (
                <span
                  key={industry}
                  className="rounded-full border border-ink/15 px-3.5 py-2 text-[12.5px] font-semibold text-steel transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-accent px-4 py-12 text-center text-ink sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink/60">
            Get in Touch
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Need supplies for your next job?
          </h2>

          <p className="mx-auto mb-6 mt-2.5 max-w-xl text-[13.5px] font-semibold leading-relaxed">
            Tell us what you need. We&apos;ll help you confirm availability,
            pricing and delivery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={waLink(
                "Hello Fuzio Gorilla, I have a question about your products."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <FaWhatsapp />
              Message on WhatsApp
            </a>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              Contact Details

              <FaArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom industrial stripe */}
      <div className="h-[7px] bg-[repeating-linear-gradient(135deg,var(--color-accent)_0_12px,var(--color-ink)_12px_24px)]" />
    </main>
  );
}