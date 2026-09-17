import type { CategoryDraft } from "@/types/fields";

export const CATEGORY_SORT_OPTIONS = [
  {
    value: "default",
    label: "Sort: Featured",
  },
  {
    value: "low",
    label: "Price: Low to High",
  },
  {
    value: "high",
    label: "Price: High to Low",
  },
] as const;


export const EMPTY_CATEGORY_DRAFT: CategoryDraft = {
  name: "",
  description: "",
  image: null,
  is_active: true,
};

export const CATEGORY_MESSAGES = {
  empty: "No categories found.",
  loadError: "Couldn't load categories right now.",
  nameRequired: "Category name is required.",
  saveError: "Couldn't save this category. Please try again.",
  deleteError: "Couldn't delete this category. Please try again.",
};