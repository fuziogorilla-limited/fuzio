import type { ProductDraft } from "@/types/fields";

export const EMPTY_PRODUCT_DRAFT: ProductDraft = {
  category: "",
  name: "",
  description: "",
  buying_price: "",
  selling_price: "",
  image: null,
  color: "",
  size: "",
  quantity: "",
  is_active: true,
  feature: false,
  variants: [],
};

export const PRODUCT_MESSAGES = {
  loadError: "Couldn't load products right now.",
  requiredNameCategory: "Name and category are required.",
  requiredPricingStock:
    "Buying price, selling price and quantity are required.",
  saveError:
    "Couldn't save this product. Please try again.",
  deleteError:
    "Couldn't delete this product. Please try again.",
  empty: "No products found.",
} as const;

export const PRODUCT = {
  whatsappMessage:
    "Hello Fuzio Gorilla,\n\nI would like to place an order.",

  imageUnavailable:
    "Product photos aren't available yet",

  loadError:
    "Couldn't load this product right now. Please try again shortly.",

  notFound:
    "We couldn't find that product.",

} as const;