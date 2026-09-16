"use client";

import { useEffect, useState } from "react";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type { Category, Product } from "@/types/category";

export function useCategoryData(categoryId: number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setCategory(null);
    setProducts([]);
    setCatLoading(true);
    setProdLoading(true);
    setCatError(false);
    setProdError(false);

    apiFetch<Category[]>(routes.inventory.publicCategories)
      .then((data) => {
        if (cancelled) return;

        const found =
          data.find((item) => item.id === categoryId) ?? null;

        setCategory(found);
      })
      .catch(() => {
        if (!cancelled) {
          setCatError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCatLoading(false);
        }
      });

    apiFetch<Product[]>(routes.inventory.publicProducts)
      .then((data) => {
        if (cancelled) return;

        setProducts(
          data.filter(
            (product) =>
              product.category === categoryId &&
              product.is_active
          )
        );
      })
      .catch(() => {
        if (!cancelled) {
          setProdError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setProdLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return {
    category,
    catLoading,
    catError,
    products,
    prodLoading,
    prodError,
  };
}