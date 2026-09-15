"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

const WHATSAPP_NUMBER = "254798982870";
const PHONE_NUMBER = "+25498 982 870";
const EMAIL = "info@fuziogorilla.co.ke";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
      <main className="w-full overflow-x-hidden bg-bg">
          {/* Hero */}
      <section className="bg-ink px-4 py-10 text-paper sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Contact Us
              </div>

              <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                Let&apos;s get the
                <br />
                job moving.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-steel-light sm:text-[15px]">
                Need a quote, checking stock, placing a bulk order or simply
                have a question? Talk directly to the Fuzio Gorilla team.
              </p>
            </div>

            <div className="border-l border-white/15 pl-5 lg:pb-1">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                Fastest response
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-steel-light">
                WhatsApp us with what you need and we&apos;ll get back to you
                with availability and pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {/* WhatsApp */}
            <a
              href={waLink(
                "Hello Fuzio Gorilla, I would like to enquire about your products."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg p-6 transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center bg-ink text-accent transition-colors group-hover:bg-ink">
                <FaWhatsapp size={18} />
              </div>

              <div className="mt-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-steel">
                  WhatsApp
                </div>

                <h3 className="mt-1 text-[15px] font-extrabold">
                  Chat with us
                </h3>

                <p className="mt-2 text-[12.5px] leading-relaxed text-steel">
                  Best for quick questions, stock checks and orders.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[12px] font-bold">
                Message us
                <FaArrowRight
                  size={10}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="group bg-bg p-6 transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center bg-ink text-accent">
                <FaPhoneAlt size={15} />
              </div>

              <div className="mt-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-steel">
                  Phone
                </div>

                <h3 className="mt-1 text-[15px] font-extrabold">
                  {PHONE_NUMBER}
                </h3>

                <p className="mt-2 text-[12.5px] leading-relaxed text-steel">
                  Speak directly with our team during working hours.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[12px] font-bold">
                Call us
                <FaArrowRight
                  size={10}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="group bg-bg p-6 transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center bg-ink text-accent">
                <FaEnvelope size={15} />
              </div>

              <div className="mt-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-steel">
                  Email
                </div>

                <h3 className="mt-1 break-all text-[15px] font-extrabold">
                  {EMAIL}
                </h3>

                <p className="mt-2 text-[12.5px] leading-relaxed text-steel">
                  For formal enquiries, quotations and business requests.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[12px] font-bold">
                Send email
                <FaArrowRight
                  size={10}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>

            {/* Location */}
            <div className="group bg-bg p-6 transition-colors hover:bg-accent">
              <div className="flex h-10 w-10 items-center justify-center bg-ink text-accent">
                <FaMapMarkerAlt size={15} />
              </div>

              <div className="mt-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-steel">
                  Location
                </div>

                <h3 className="mt-1 text-[15px] font-extrabold">
                  Nairobi, Kenya
                </h3>

                <p className="mt-2 text-[12.5px] leading-relaxed text-steel">
                  Warehouse and dispatch operations based in Nairobi.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[12px] font-bold">
                Kenya
              </div>
            </div>
          </div>
        </div>
          </section>
          
      <section className="bg-ink-2 px-4 py-14 text-paper sm:px-6 sm:py-18">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* Left information */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Send an Enquiry
              </div>

              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Tell us what you need.
              </h2>

              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-steel-light">
                Give us a few details and our team can help with product
                availability, quantities, pricing and delivery.
              </p>

              {/* Response expectations */}
              <div className="mt-9 space-y-4 border-t border-white/10 pt-7">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-ink">
                    <FaCheck size={10} />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-bold text-paper">
                      Stock confirmation
                    </h4>

                    <p className="mt-1 text-[12px] leading-relaxed text-steel-light">
                      We confirm whether the products and quantities you need
                      are available.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-ink">
                    <FaCheck size={10} />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-bold text-paper">
                      Clear pricing
                    </h4>

                    <p className="mt-1 text-[12px] leading-relaxed text-steel-light">
                      For larger orders, we can provide a quotation based on
                      your actual requirements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-ink">
                    <FaCheck size={10} />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-bold text-paper">
                      Delivery information
                    </h4>

                    <p className="mt-1 text-[12px] leading-relaxed text-steel-light">
                      We confirm the delivery method, location and cost before
                      your order moves.
                    </p>
                  </div>
                </div>
              </div>

              {/* Working hours */}
              <div className="mt-9 flex items-start gap-3 border-t border-white/10 pt-7">
                <FaClock className="mt-1 shrink-0 text-accent" size={15} />

                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    Working Hours
                  </div>

                  <p className="mt-1 text-[13px] text-paper">
                    Monday – Friday: 8:00 AM – 5:00 PM
                  </p>

                  <p className="mt-1 text-[12px] text-steel-light">
                    Saturday: 9:00 AM – 1:00 PM
                  </p>
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
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                      Contact Form
                    </div>

                    <h3 className="mt-2 text-xl font-black text-paper">
                      Send us the details.
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full border border-white/10 bg-ink-2 px-4 py-3 text-[13px] text-paper outline-none placeholder:text-steel focus:border-accent"
                      />
                    </div>

                    {/* Phone + Email */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
                        >
                          Phone
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+254..."
                          className="w-full border border-white/10 bg-ink-2 px-4 py-3 text-[13px] text-paper outline-none placeholder:text-steel focus:border-accent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
                        >
                          Email
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="w-full border border-white/10 bg-ink-2 px-4 py-3 text-[13px] text-paper outline-none placeholder:text-steel focus:border-accent"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
                      >
                        Company
                        <span className="ml-1 font-normal text-steel">
                          (optional)
                        </span>
                      </label>

                      <input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Company or organisation"
                        className="w-full border border-white/10 bg-ink-2 px-4 py-3 text-[13px] text-paper outline-none placeholder:text-steel focus:border-accent"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
                      >
                        What do you need?
                      </label>

                      <select
                        id="subject"
                        name="subject"
                        required
                        defaultValue=""
                        className="w-full border border-white/10 bg-ink-2 px-4 py-3 text-[13px] text-paper outline-none focus:border-accent"
                      >
                        <option value="" disabled>
                          Select an enquiry type
                        </option>
                        <option value="product">
                          Product enquiry
                        </option>
                        <option value="bulk">
                          Bulk order / quotation
                        </option>
                        <option value="stock">
                          Stock availability
                        </option>
                        <option value="delivery">
                          Delivery enquiry
                        </option>
                        <option value="other">
                          Something else
                        </option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-steel-light"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us what products, quantities or services you need..."
                        className="w-full resize-none border border-white/10 bg-ink-2 px-4 py-3 text-[13px] leading-relaxed text-paper outline-none placeholder:text-steel focus:border-accent"
                      />
                    </div>

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

      <section className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid overflow-hidden border border-ink/10 lg:grid-cols-[1fr_1fr]">
            {/* Location */}
            <div className="min-h-[300px] bg-ink p-7 text-paper sm:p-10">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                Find Us
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Nairobi, Kenya.
              </h2>

              <p className="mt-4 max-w-md text-[13px] leading-relaxed text-steel-light">
                Our warehouse and dispatch operations are based in Nairobi,
                serving customers across Nairobi and shipping nationwide.
              </p>

              <div className="mt-8 flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-accent" />

                <div>
                  <div className="text-[13px] font-bold text-paper">
                    Fuzio Gorilla
                  </div>

                  <div className="mt-1 text-[12px] text-steel-light">
                    Nairobi, Kenya
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="flex min-h-[300px] flex-col justify-center bg-accent p-7 text-ink sm:p-10">
              <div className="flex h-11 w-11 items-center justify-center bg-ink text-accent">
                <FaWhatsapp size={20} />
              </div>

              <h2 className="mt-6 max-w-md text-2xl font-black tracking-tight sm:text-3xl">
                Prefer WhatsApp?
              </h2>

              <p className="mt-3 max-w-md text-[13px] font-semibold leading-relaxed">
                Send us your product list, quantities or a photo of what you
                need. We&apos;ll take it from there.
              </p>

              <a
                href={waLink(
                  "Hello Fuzio Gorilla, I would like to get a quote."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 border-2 border-ink bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Start WhatsApp Chat
                <FaArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-ink-2 px-4 py-10 text-center text-paper sm:px-6">
        <div className="mx-auto max-w-[700px]">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
            Need something else?
          </div>

          <h2 className="mt-2 text-xl font-black sm:text-2xl">
            Browse our products and see what&apos;s in stock.
          </h2>

          <Link
            href="/"
            className="group mt-5 inline-flex items-center gap-2 border-2 border-accent px-6 py-3 text-[12px] font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            Browse Products
            <FaArrowRight
              size={10}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
