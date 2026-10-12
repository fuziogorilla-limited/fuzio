// app/contact/page.tsx
"use client";

import { FormEvent, useState } from "react";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaCheck,
  FaTools,
} from "react-icons/fa";

import { SITE } from "@/constants/shared";
import { PILLARS, WA } from "../content";
import { SectionLabel, CtaLink, PageHero } from "@/components/shared";

const CONTACT = {
  phone: SITE.contact.phone,
  phoneLink: SITE.contact.phoneLink,
  email: SITE.contact.email,
  city: "Nairobi",
  country: "Kenya",
  hours: [
    "Monday – Friday: 8:00 AM – 5:00 PM",
    "Saturday: 9:00 AM – 1:00 PM",
  ],
} as const;

const ENQUIRY_TYPES = [
  "Energy / Solar",
  "Machinery & Equipment",
  "Industrial Supplies",
  "Installation / Technical Support",
  "Bulk Order",
  "Project Enquiry",
  "Other",
] as const;

// Pillars + installation, reused from the shared content.
const HELP_ITEMS = [
  ...PILLARS.map((p) => ({ icon: p.icon, title: p.title, body: p.short })),
  {
    icon: FaTools,
    title: "Installation & Projects",
    body: "Installation, setup and technical support for applicable equipment and solutions.",
  },
];

const INPUT_CLASS =
  "w-full border border-white/10 bg-ink-2 px-4 py-3 text-[13px] text-paper outline-none placeholder:text-steel focus:border-accent";

/* -------------------------------------------------------------------------- */
/*  Local pieces                                                              */
/* -------------------------------------------------------------------------- */

function ContactCard({
  href,
  external = false,
  icon,
  label,
  title,
  body,
  action,
}: {
  href?: string;
  external?: boolean;
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  action: string;
}) {
  const inner = (
    <>
      <div className="flex h-10 w-10 items-center justify-center bg-ink text-accent">
        {icon}
      </div>

      <div className="mt-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-steel">
          {label}
        </div>
        <h3 className="mt-1 break-all text-[15px] font-extrabold">{title}</h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-steel">{body}</p>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[12px] font-bold">
        {action}
        {href && (
          <FaArrowRight
            size={10}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </div>
    </>
  );

  const className = "group bg-bg p-6 transition-colors hover:bg-accent";

  return href ? (
    <a
      href={href}
      className={className}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function Field({
  id,
  label,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
      >
        {label}
        {optional && (
          <span className="ml-1 font-normal text-steel">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    // TODO: send to the backend / email service. Currently logs only.
    console.log("Contact enquiry:", data);

    setSubmitted(true);
  }

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      <PageHero
        label="Contact Fuzio Gorilla"
        title={
          <>
            Let&apos;s get the
            <br />
            job moving.
          </>
        }
        intro="Looking for equipment, industrial supplies, an energy solution or installation support? Tell us what you're working on and we'll help you find the right way forward."
        asideLabel="Fastest response"
        aside="Send a product name, specification, quantity, project details or even a photo on WhatsApp."
      />

      {/* CONTACT METHODS */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              href={WA.general}
              external
              icon={<FaWhatsapp size={18} />}
              label="WhatsApp"
              title="Chat with us"
              body="The fastest way to reach us. Send a product name, specification, quantity, project details or even a photo."
              action="Chat on WhatsApp"
            />
            <ContactCard
              href={`tel:${CONTACT.phoneLink}`}
              icon={<FaPhoneAlt size={15} />}
              label="Phone"
              title={CONTACT.phone}
              body="Speak directly with our team during working hours."
              action="Call us"
            />
            <ContactCard
              href={`mailto:${CONTACT.email}`}
              icon={<FaEnvelope size={15} />}
              label="Email"
              title={CONTACT.email}
              body="For quotations, project enquiries and formal business requests."
              action="Send an email"
            />
            <ContactCard
              icon={<FaMapMarkerAlt size={15} />}
              label="Location"
              title={`${CONTACT.city}, ${CONTACT.country}`}
              body="Our operations are based in Nairobi, serving customers and projects across Kenya."
              action="Kenya"
            />
          </div>
        </div>
      </section>

      {/* HOW WE CAN HELP + FORM */}
      <section className="bg-ink-2 px-4 py-14 text-paper sm:px-6 sm:py-18">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel tone="light">How we can help</SectionLabel>

              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Tell us about the job.
              </h2>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-7">
                {HELP_ITEMS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-ink">
                        <Icon size={11} />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold uppercase text-paper">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[12px] leading-relaxed text-steel-light">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-9 flex items-start gap-3 border-t border-white/10 pt-7">
                <FaClock className="mt-1 shrink-0 text-accent" size={15} />
                <div>
                  <SectionLabel tone="light">Working hours</SectionLabel>
                  {CONTACT.hours.map((line) => (
                    <p key={line} className="mt-1 text-[13px] text-paper">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="border border-white/10 bg-ink p-6 sm:p-8">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center bg-accent text-ink">
                    <FaCheck size={22} />
                  </div>
                  <h3 className="mt-6 text-2xl font-black">
                    Enquiry received.
                  </h3>
                  <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-steel-light">
                    Thanks for reaching out. Our team will review your enquiry
                    and get back to you.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-7 border border-white/20 px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <SectionLabel tone="light">Send an enquiry</SectionLabel>
                    <h3 className="mt-2 text-xl font-black text-paper">
                      Tell us about the job.
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Field id="name" label="Name">
                      <input id="name" name="name" type="text" required placeholder="Your name" className={INPUT_CLASS} />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="phone" label="Phone">
                        <input id="phone" name="phone" type="tel" required placeholder="+254..." className={INPUT_CLASS} />
                      </Field>
                      <Field id="email" label="Email">
                        <input id="email" name="email" type="email" placeholder="you@example.com" className={INPUT_CLASS} />
                      </Field>
                    </div>

                    <Field id="company" label="Company" optional>
                      <input id="company" name="company" type="text" placeholder="Company or organisation" className={INPUT_CLASS} />
                    </Field>

                    <Field id="subject" label="Enquiry type">
                      <select id="subject" name="subject" required defaultValue="" className={INPUT_CLASS}>
                        <option value="" disabled>
                          Select an enquiry type
                        </option>
                        {ENQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field id="message" label="Message">
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Include any useful details such as specifications, quantities, location or project requirements."
                        className={`${INPUT_CLASS} resize-none leading-relaxed`}
                      />
                    </Field>

                    <button
                      type="submit"
                      className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
                    >
                      Send Enquiry
                      <FaArrowRight
                        size={11}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>

                    <p className="text-center text-[10px] leading-relaxed text-steel">
                      By submitting this form, you&apos;re requesting that
                      Fuzio Gorilla contacts you regarding your enquiry.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION + WHATSAPP */}
      <section className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid overflow-hidden border border-ink/10 lg:grid-cols-2">
            <div className="min-h-[300px] bg-ink p-7 text-paper sm:p-10">
              <SectionLabel tone="light">Find us</SectionLabel>

              <h2 className="mt-3 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                {CONTACT.city}, {CONTACT.country}
              </h2>

              <p className="mt-4 max-w-md text-[13px] leading-relaxed text-steel-light">
                Our operations are based in Nairobi, serving customers and
                projects across Kenya.
              </p>

              <div className="mt-8 flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-accent" />
                <div className="text-[13px] font-bold text-paper">
                  Fuzio Gorilla Industries Ltd
                </div>
              </div>
            </div>

            <div className="flex min-h-[300px] flex-col justify-center bg-accent p-7 text-ink sm:p-10">
              <div className="flex h-11 w-11 items-center justify-center bg-ink text-accent">
                <FaWhatsapp size={20} />
              </div>

              <h2 className="mt-6 max-w-md text-2xl font-black tracking-tight sm:text-3xl">
                Have a requirement? Send it our way.
              </h2>

              <p className="mb-6 mt-3 max-w-md text-[13px] font-semibold leading-relaxed">
                Whether it&apos;s a product, piece of equipment or complete
                solution, start with what you need and we&apos;ll take it from
                there.
              </p>

              <div>
                <CtaLink href={WA.quote} variant="inkOnAccent">
                  WhatsApp Us
                </CtaLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}