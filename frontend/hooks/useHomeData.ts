"use client";

import { usePublicCategories } from "@/hooks/useCategories";
import { usePublicProducts } from "@/hooks/useProducts";

export function useHomeData() {
  const publicCategories = usePublicCategories();
  const publicProducts = usePublicProducts();

  return {
    categories: publicCategories.categories,
    catLoading: publicCategories.loading,
    catError: publicCategories.error,
    featured: publicProducts.products.filter((product) => product.feature && product.is_active).slice(0, 4),
    prodLoading: publicProducts.loading,
    prodError: publicProducts.error,
  };
}