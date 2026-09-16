export type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
};

export type Product = {
  id: number;
  category: number;
  name: string;
  description: string;
  selling_price: string;
  color: string;
  size: string;
  image?: string | null;
  is_active: boolean;
  feature: boolean;
};

export type SortOption = "default" | "low" | "high";