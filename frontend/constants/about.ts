import {
  FaHandshake,
  FaWarehouse,
  FaBoxOpen,
  FaTruck,
} from "react-icons/fa";

import type { ProcessStep } from "@/types/fields";

export const INDUSTRIES = [
  "Construction",
  "Automotive",
  "Solar & Electrical",
  "Manufacturing",
  "Agriculture",
  "Logistics",
  "Mining",
  "Oil & Gas",
  "Welding & Fabrication",
  "Utilities",
  "Marine & Ports",
  "Railway",
];

export const PROCESS: Array<
  ProcessStep & {
    icon: typeof FaHandshake;
  }
> = [
  {
    icon: FaHandshake,
    title: "Source",
    body: "We work directly with manufacturers and certified suppliers, not middlemen, so pricing stays honest and quality stays consistent.",
  },
  {
    icon: FaWarehouse,
    title: "Stock",
    body: "Core items are held in our Nairobi warehouse so common sizes and quantities are ready to ship the same day.",
  },
  {
    icon: FaBoxOpen,
    title: "Supply",
    body: "Order online, on WhatsApp, or by phone. A real person confirms pricing and availability before anything ships.",
  },
  {
    icon: FaTruck,
    title: "Deliver",
    body: "We deliver across Nairobi and dispatch countrywide via trusted couriers, with delivery cost confirmed upfront.",
  },
];

export const STORY_STEPS = [
  {
    label: "THE PROBLEM",
    title: "Too many suppliers.",
    body: "Overalls from one supplier. Gloves from another. Bin liners, signage, tools and safety equipment somewhere else. Different prices, different delivery dates and too much time wasted coordinating it all.",
  },
  {
    label: "THE IDEA",
    title: "Put the essentials together.",
    body: "We built a single source for the everyday products that businesses actually use, selected for durability, availability and value rather than appearance.",
  },
  {
    label: "TODAY",
    title: "Supply without the headache.",
    body: "Today, customers can browse online, order through WhatsApp or speak directly with our team. We confirm availability, pricing and delivery before the order moves.",
  },
];

export const BRAND_VALUES = [
  "Durable products",
  "Straightforward pricing",
  "Reliable supply",
];