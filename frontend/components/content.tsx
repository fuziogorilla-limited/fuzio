// constants/content.ts
// Single source of truth for copy used on more than one page.

import { FaSolarPanel, FaCogs, FaBoxOpen } from "react-icons/fa";
import { waLink } from "@/lib/utils";

/* WhatsApp prefilled messages (no quote form yet; swap QUOTE for a /quote page later) */
export const WA = {
  quote: waLink(
    "Hello Fuzio Gorilla, I would like to request a quote.\n\nProduct / equipment / project needed:\nQuantity or specification:\nDelivery location:"
  ),
  team: waLink(
    "Hello Fuzio Gorilla, I'd like to talk to your team about my requirement."
  ),
  general: waLink(
    "Hello Fuzio Gorilla, I would like to enquire about your products and services."
  ),
} as const;

/* The three business lines. Used on Home, About and Contact. */
// TODO: point `href` at dedicated /energy and /machinery pages when they exist.
export const PILLARS = [
  {
    id: "energy",
    icon: FaSolarPanel,
    title: "Energy",
    summary: "Solar and electrical systems for homes, businesses and projects.",
    items: [
      "Solar PV",
      "Inverters",
      "Batteries",
      "BESS",
      "Electrical Equipment",
      "Solar Accessories",
    ],
    note: "From individual components to complete installations, we help customers select and deploy the right system.",
    short:
      "Solar PV, energy storage, inverters, electrical equipment and related energy systems for businesses and projects.",
    cta: "Explore Energy",
    href: "/all-products",
  },
  {
    id: "machinery",
    icon: FaCogs,
    title: "Machinery & Equipment",
    summary:
      "Equipment for industrial, construction, agricultural, workshop and commercial applications.",
    items: [
      "Industrial Machinery",
      "Workshop Equipment",
      "Power Equipment",
      "Tools",
      "Material Handling",
    ],
    note: "Where required, we support equipment setup, installation and commissioning.",
    short:
      "Machinery, tools and equipment for industrial, construction, agricultural, workshop and commercial applications.",
    cta: "Explore Machinery",
    href: "/all-products",
  },
  {
    id: "supplies",
    icon: FaBoxOpen,
    title: "Industrial Supplies",
    summary: "Essential products for workplaces, sites and day-to-day operations.",
    items: [
      "Packaging",
      "Cleaning",
      "Maintenance",
      "Workwear",
      "PPE",
      "Electrical",
      "Waste Management",
      "Workplace Supplies",
    ],
    note: "Available for individual purchases, bulk orders and recurring requirements.",
    short:
      "PPE, workwear, maintenance products, packaging, cleaning supplies, electrical accessories and everyday workplace essentials.",
    cta: "Explore Industrial Supplies",
    href: "/all-products",
  },
] as const;

/* `home: true` = also shown in the shorter list on the home page. */
export const INDUSTRIES = [
  { name: "Construction", home: true },
  { name: "Manufacturing", home: true },
  { name: "Energy & Solar", home: true },
  { name: "Logistics & Warehousing", home: true },
  { name: "Automotive", home: true },
  { name: "Agriculture", home: true },
  { name: "Hospitality", home: true },
  { name: "Offices & Facilities", home: true },
  { name: "Workshops & Industrial Operations", home: true },
  { name: "Mining", home: false },
  { name: "Oil & Gas", home: false },
  { name: "Welding & Fabrication", home: false },
  { name: "Utilities", home: false },
  { name: "Marine & Ports", home: false },
  { name: "Railway", home: false },
] as const;