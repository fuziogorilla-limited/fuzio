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

export const EMPTY_CATEGORY_DRAFT = {
  name: "",
  description: "",
  is_active: true,
} as const;

export const CATEGORY_MESSAGES = {
  loadError: "Couldn't load categories right now.",
  nameRequired: "Name is required.",
  saveError: "Couldn't save this category. Please try again.",
  deleteError: "Couldn't delete this category. Please try again.",
  empty: "No categories yet. Add your first one above.",
} as const;