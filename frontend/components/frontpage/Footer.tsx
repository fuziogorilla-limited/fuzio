import Link from "next/link";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaTruck,
} from "react-icons/fa";

import { SITE } from "@/constants/site";
import {
  FOOTER_CATEGORIES,
  FOOTER_WHATSAPP_MESSAGE,
} from "@/constants/footer";
import { waLink } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="w-full overflow-x-hidden bg-ink pt-11 pb-5 text-steel-light">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="mb-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 min-w-0 md:col-span-1">
            <h5 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-paper">
              {SITE.name}
            </h5>

            <p className="mb-2 max-w-[220px] break-words text-[13px] leading-relaxed">
              Industrial workwear &amp; supplies. Fuzio Gorilla Industries
              Ltd. Kenya.
            </p>

            <p className="text-[13px] leading-relaxed">
              Mon–Sat, 8:00–18:00 EAT
            </p>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h5 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-paper">
              Quick Links
            </h5>

            <nav className="flex flex-col gap-2.5 text-[13px]">
              <Link
                href="/shop"
                className="transition-colors hover:text-accent"
              >
                Shop
              </Link>

              <Link
                href="/about"
                className="transition-colors hover:text-accent"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="transition-colors hover:text-accent"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="min-w-0">
            <h5 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-paper">
              Categories
            </h5>

            <nav className="flex flex-col gap-2.5 text-[13px]">
              {FOOTER_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="truncate transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="min-w-0">
            <h5 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-paper">
              Support
            </h5>

            <nav className="flex flex-col gap-2.5 text-[13px]">
              {/* WhatsApp */}
              <a
                href={waLink(FOOTER_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-accent"
              >
                <FaWhatsapp className="shrink-0" />
                WhatsApp
              </a>

              {/* Phone */}
              <a
                href={`tel:${SITE.contact.phoneLink}`}
                className="flex items-center gap-2 transition-colors hover:text-accent"
              >
                <FaPhoneAlt className="shrink-0 text-[11px]" />
                {SITE.contact.phone}
              </a>

              {/* Email */}
              <a
                href={`mailto:${SITE.contact.email}`}
                className="flex items-center gap-2 break-all transition-colors hover:text-accent"
              >
                <FaEnvelope className="shrink-0" />
                {SITE.contact.email}
              </a>

              {/* Delivery */}
              <Link
                href="/delivery-returns"
                className="flex items-center gap-2 transition-colors hover:text-accent"
              >
                <FaTruck className="shrink-0" />
                Delivery &amp; Returns
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between gap-2.5 border-t border-white/10 pt-[18px] text-[11.5px] text-steel">
          <span>
            © {new Date().getFullYear()} {SITE.name} Industries Ltd. All
            rights reserved.
          </span>

          <span>Terms · Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}