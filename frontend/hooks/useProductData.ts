import { useEffect, useState } from "react";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type { PublicProduct as Product, PublicCategory as ProductCategory } from "@/types/fields";

export function useProductData(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Product[]>(routes.inventory.publicProducts)
      .then(async (products) => {
        if (cancelled) return;

        const found =
          products.find(
            (item) =>
              item.id === productId &&
              item.is_active
          ) ?? null;

        if (!found) {
          setNotFound(true);
          return;
        }

        setProduct(found);

        const categories =
          await apiFetch<ProductCategory[]>(
            routes.inventory.publicCategories
          );

        if (cancelled) return;

        setCategory(
          categories.find(
            (item) => item.id === found.category
          ) ?? null
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return {
    product,
    category,
    loading,
    error,
    notFound,
  };
}