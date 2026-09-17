"use client";

import { useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type { PublicCategory as Category, PublicProduct as Product } from "@/types/fields";

export function useHomeData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [featured, setFeatured] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Category[]>(routes.inventory.publicCategories)
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
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

        setFeatured(
          data.filter((product) => product.feature && product.is_active).slice(0, 4)
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
  }, []);

  return {
    categories,
    catLoading,
    catError,

    featured,
    prodLoading,
    prodError,
  };
}