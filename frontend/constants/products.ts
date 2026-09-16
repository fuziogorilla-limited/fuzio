import type { ProductDraft } from "@/types/product";

export const EMPTY_PRODUCT_DRAFT: ProductDraft = {
  category: "",
  name: "",
  description: "",
  buying_price: "",
  selling_price: "",
  color: "",
  size: "",
  quantity: "",
  is_active: true,
  feature: false,
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