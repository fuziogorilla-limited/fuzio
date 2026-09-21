import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

import type {
  Category,
  Product,
  ProductDraft,
  PublicCategory,
  PublicProduct,
} from "@/types/fields";

const EMPTY_PRODUCT_DRAFT: ProductDraft = {
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

type ApiErrorShape = {
  status?: number;
  data?: Record<string, unknown> | null;
};

function extractErrorMessage(
  err: unknown,
  fallback: string
) {
  const apiError = err as ApiErrorShape;

  if (apiError?.data) {
    const firstKey = Object.keys(apiError.data)[0];

    if (firstKey) {
      const value = apiError.data[firstKey];

      if (
        Array.isArray(value) &&
        typeof value[0] === "string"
      ) {
        return value[0];
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  return fallback;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | number
  >("all");

  const [deletingId, setDeletingId] = useState<number | null>(
    null
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">(
    "add"
  );
  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [draft, setDraft] =
    useState<ProductDraft>(EMPTY_PRODUCT_DRAFT);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      apiFetch<Product[]>(routes.inventory.products),
      apiFetch<Category[]>(routes.inventory.categories),
    ])
      .then(([productsData, categoriesData]) => {
        if (cancelled) return;

        setProducts(productsData);
        setCategories(categoriesData);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            extractErrorMessage(
              err,
              "Couldn't load products right now."
            )
          );
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
  }, []);

  const categoryName = (id: number) =>
    categories.find((category) => category.id === id)?.name ??
    "Uncategorised";

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);

    setDraft({
      ...EMPTY_PRODUCT_DRAFT,
      category: categories[0]?.id ?? "",
    });

    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode("edit");
    setEditingId(product.id);

    setDraft({
      category: product.category,
      name: product.name,
      description: product.description,
      buying_price: product.buying_price,
      selling_price: product.selling_price,
      image: null,
      color: product.variants[0]?.color ?? "",
      size: product.variants[0]?.size ?? "",
      quantity: String(product.variants[0]?.quantity ?? 0),
      is_active: product.is_active,
      feature: product.feature,
      variants: product.variants,
    });

    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
  };

  const updateDraft = <K extends keyof ProductDraft>(
    field: K,
    value: ProductDraft[K]
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!draft.name.trim() || draft.category === "") {
      setFormError(
        "Name and category are required."
      );
      return;
    }

    if (
      draft.buying_price === "" ||
      draft.selling_price === "" ||
      draft.quantity === ""
    ) {
      setFormError(
        "Buying price, selling price and quantity are required."
      );
      return;
    }

    const payload = {
      category: Number(draft.category),
      name: draft.name,
      description: draft.description,
      buying_price: draft.buying_price,
      selling_price: draft.selling_price,
      is_active: draft.is_active,
      feature: draft.feature,
      variants: [
        {
          color: draft.color,
          size: draft.size,
          quantity: Number(draft.quantity),
        },
      ],
    };

    setSaving(true);
    setFormError(null);

    try {
      if (modalMode === "add") {
        const response = await apiFetch<{
          message: string;
          product: Product;
        }>(routes.inventory.products, {
          method: "POST",
          body: payload,
        });

        setProducts((current) => [
          response.product,
          ...current,
        ]);
      }

      if (modalMode === "edit" && editingId !== null) {
        const response = await apiFetch<{
          message: string;
          product: Product;
        }>(routes.inventory.product(editingId), {
          method: "PATCH",
          body: payload,
        });

        setProducts((current) =>
          current.map((product) =>
            product.id === editingId
              ? response.product
              : product
          )
        );
      }

      setModalOpen(false);
    } catch (err) {
      setFormError(
        extractErrorMessage(
          err,
          "Couldn't save this product. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: number,
    name: string
  ) => {
    if (
      !window.confirm(
        `Delete "${name}"? This can't be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      await apiFetch(routes.inventory.product(id), {
        method: "DELETE",
      });

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );
    } catch (err) {
      alert(
        extractErrorMessage(
          err,
          "Couldn't delete this product. Please try again."
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  return {
    products,
    categories,
    filteredProducts,

    loading,
    loadError,

    search,
    setSearch,

    categoryFilter,
    setCategoryFilter,

    deletingId,

    modalOpen,
    modalMode,
    editingId,

    draft,
    updateDraft,

    saving,
    formError,

    categoryName,

    openAddModal,
    openEditModal,
    closeModal,

    handleSubmit,
    handleDelete,
  };
}

// Public product reads belong here so product pages share one API source.
export function useProductData(productId: number) {
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [category, setCategory] = useState<PublicCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<PublicProduct[]>(routes.inventory.publicProducts)
      .then(async (products) => {
        if (cancelled) return;

        const found = products.find((item) => item.id === productId && item.is_active) ?? null;
        if (!found) {
          setNotFound(true);
          return;
        }

        setProduct(found);
        const categories = await apiFetch<PublicCategory[]>(routes.inventory.publicCategories);
        if (!cancelled) {
          setCategory(categories.find((item) => item.id === found.category) ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { product, category, loading, error, notFound };
}

// Home uses the same public product endpoint as product detail pages.
export function usePublicProducts() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<PublicProduct[]>(routes.inventory.publicProducts)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}