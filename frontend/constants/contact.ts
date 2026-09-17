import { SITE } from "@/constants/site";

export const CONTACT = {
  phone: SITE.contact.phone,
  phoneLink: SITE.contact.phoneLink,
  email: SITE.contact.email,

  location: {
    city: "Nairobi",
    country: "Kenya",
    description:
      "Warehouse and dispatch operations based in Nairobi.",
  },

  workingHours: {
    weekdays: "Monday – Friday: 8:00 AM – 5:00 PM",
    saturday: "Saturday: 9:00 AM – 1:00 PM",
  },
} as const;

export const CONTACT_RESPONSE_POINTS = [
  {
    title: "Stock confirmation",
    body: "We confirm whether the products and quantities you need are available.",
  },
  {
    title: "Clear pricing",
    body: "For larger orders, we can provide a quotation based on your actual requirements.",
  },
  {
    title: "Delivery information",
    body: "We confirm the delivery method, location and cost before your order moves.",
  },
] as const;

export const ENQUIRY_TYPES = [
  {
    value: "product",
    label: "Product enquiry",
  },
  {
    value: "bulk",
    label: "Bulk order / quotation",
  },
  {
    value: "stock",
    label: "Stock availability",
  },
  {
    value: "delivery",
    label: "Delivery enquiry",
  },
  {
    value: "other",
    label: "Something else",
  },
] as const;