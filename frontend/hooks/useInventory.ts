"use client";

import { useCallback, useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type {
    ID,
    ApiMessageResponse,
    ApiDeleteResponse,
    CategoryPayload,
    CategoryCreateInput,
    ColorPayload,
    ColorCreateInput,
    SizePayload,
    SizeCreateInput,
    ProductPayload,
    ProductCreateInput,
    ProductVariantPayload,
    ProductVariantCreateInput,
    GuestProduct,
    GuestProductVariant,
} from "@/types/inventory";

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Builds a FormData payload from a plain object, skipping undefined/null
 * values so PATCH requests can stay partial. Booleans are stringified since
 * multipart bodies only carry strings/files.
 */
function toFormData<T extends object>(input: T): FormData {
    const formData = new FormData();

    Object.entries(input).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (value instanceof File) {
            formData.append(key, value);
        } else if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
}

function getErrorMessage(err: unknown, fallback: string): string {
    if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object"
    ) {
        const data = err.data as Record<string, unknown>;

        // DRF validation errors: { field: ["msg"] } or { detail: "msg" }
        const firstValue = Object.values(data)[0];

        if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
            return firstValue[0];
        }

        if (typeof data.detail === "string") return data.detail;
        if (typeof data.message === "string") return data.message;
    }

    return fallback;
}

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

export function useCategories() {
    const [categories, setCategories] = useState<CategoryPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<CategoryPayload[]>(
                routes.inventory.categories
            );
            setCategories(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load categories"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCategory = useCallback(
        async (input: CategoryCreateInput) => {
            const body = toFormData(input);
            const res = await apiFetch<ApiMessageResponse<CategoryPayload>>(
                routes.inventory.categories,
                { method: "POST", body }
            );
            setCategories((prev) => [...prev, res.data]);
            return res.data;
        },
        []
    );

    const updateCategory = useCallback(
        async (id: ID, input: Partial<CategoryCreateInput>) => {
            const body = toFormData(input);
            const res = await apiFetch<ApiMessageResponse<CategoryPayload>>(
                routes.inventory.category(id),
                { method: "PATCH", body }
            );
            setCategories((prev) =>
                prev.map((c) => (c.id === id ? res.data : c))
            );
            return res.data;
        },
        []
    );

    const deleteCategory = useCallback(async (id: ID) => {
        await apiFetch<ApiDeleteResponse>(routes.inventory.category(id), {
            method: "DELETE",
        });
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}

/* -------------------------------------------------------------------------- */
/*  Colors                                                                    */
/* -------------------------------------------------------------------------- */

export function useColors() {
    const [colors, setColors] = useState<ColorPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchColors = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<ColorPayload[]>(
                routes.inventory.colors
            );
            setColors(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load colors"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createColor = useCallback(async (input: ColorCreateInput) => {
        const res = await apiFetch<ApiMessageResponse<ColorPayload>>(
            routes.inventory.colors,
            { method: "POST", body: input }
        );
        setColors((prev) => [...prev, res.data]);
        return res.data;
    }, []);

    const updateColor = useCallback(
        async (id: ID, input: Partial<ColorCreateInput>) => {
            const res = await apiFetch<ApiMessageResponse<ColorPayload>>(
                routes.inventory.color(id),
                { method: "PATCH", body: input }
            );
            setColors((prev) => prev.map((c) => (c.id === id ? res.data : c)));
            return res.data;
        },
        []
    );

    const deleteColor = useCallback(async (id: ID) => {
        await apiFetch<ApiDeleteResponse>(routes.inventory.color(id), {
            method: "DELETE",
        });
        setColors((prev) => prev.filter((c) => c.id !== id));
    }, []);

    useEffect(() => {
        fetchColors();
    }, [fetchColors]);

    return {
        colors,
        loading,
        error,
        fetchColors,
        createColor,
        updateColor,
        deleteColor,
    };
}

/* -------------------------------------------------------------------------- */
/*  Sizes                                                                     */
/* -------------------------------------------------------------------------- */

export function useSizes() {
    const [sizes, setSizes] = useState<SizePayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSizes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<SizePayload[]>(routes.inventory.sizes);
            setSizes(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load sizes"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createSize = useCallback(async (input: SizeCreateInput) => {
        const res = await apiFetch<ApiMessageResponse<SizePayload>>(
            routes.inventory.sizes,
            { method: "POST", body: input }
        );
        setSizes((prev) => [...prev, res.data]);
        return res.data;
    }, []);

    const updateSize = useCallback(
        async (id: ID, input: Partial<SizeCreateInput>) => {
            const res = await apiFetch<ApiMessageResponse<SizePayload>>(
                routes.inventory.size(id),
                { method: "PATCH", body: input }
            );
            setSizes((prev) => prev.map((s) => (s.id === id ? res.data : s)));
            return res.data;
        },
        []
    );

    const deleteSize = useCallback(async (id: ID) => {
        await apiFetch<ApiDeleteResponse>(routes.inventory.size(id), {
            method: "DELETE",
        });
        setSizes((prev) => prev.filter((s) => s.id !== id));
    }, []);

    useEffect(() => {
        fetchSizes();
    }, [fetchSizes]);

    return {
        sizes,
        loading,
        error,
        fetchSizes,
        createSize,
        updateSize,
        deleteSize,
    };
}

/* -------------------------------------------------------------------------- */
/*  Products                                                                  */
/* -------------------------------------------------------------------------- */

export function useProducts() {
    const [products, setProducts] = useState<ProductPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<ProductPayload[]>(
                routes.inventory.products
            );
            setProducts(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load products"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createProduct = useCallback(async (input: ProductCreateInput) => {
        const body = toFormData(input);
        const res = await apiFetch<ApiMessageResponse<ProductPayload>>(
            routes.inventory.products,
            { method: "POST", body }
        );
        setProducts((prev) => [res.data, ...prev]);
        return res.data;
    }, []);

    const updateProduct = useCallback(
        async (id: ID, input: Partial<ProductCreateInput>) => {
            const body = toFormData(input);
            const res = await apiFetch<ApiMessageResponse<ProductPayload>>(
                routes.inventory.product(id),
                { method: "PATCH", body }
            );
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? res.data : p))
            );
            return res.data;
        },
        []
    );

    const deleteProduct = useCallback(async (id: ID) => {
        await apiFetch<ApiDeleteResponse>(routes.inventory.product(id), {
            method: "DELETE",
        });
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}

/* -------------------------------------------------------------------------- */
/*  Product Variants                                                          */
/* -------------------------------------------------------------------------- */

export function useProductVariants() {
    const [variants, setVariants] = useState<ProductVariantPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVariants = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<ProductVariantPayload[]>(
                routes.inventory.productVariants
            );
            setVariants(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load product variants"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createVariant = useCallback(
        async (input: ProductVariantCreateInput) => {
            const res = await apiFetch<ApiMessageResponse<ProductVariantPayload>>(
                routes.inventory.productVariants,
                { method: "POST", body: input }
            );
            setVariants((prev) => [...prev, res.data]);
            return res.data;
        },
        []
    );

    const updateVariant = useCallback(
        async (id: ID, input: Partial<ProductVariantCreateInput>) => {
            const res = await apiFetch<ApiMessageResponse<ProductVariantPayload>>(
                routes.inventory.productVariant(id),
                { method: "PATCH", body: input }
            );
            setVariants((prev) =>
                prev.map((v) => (v.id === id ? res.data : v))
            );
            return res.data;
        },
        []
    );

    const deleteVariant = useCallback(async (id: ID) => {
        await apiFetch<ApiDeleteResponse>(
            routes.inventory.productVariant(id),
            { method: "DELETE" }
        );
        setVariants((prev) => prev.filter((v) => v.id !== id));
    }, []);

    /** Convenience selector — variants belonging to one product. */
    const variantsForProduct = useCallback(
        (productId: ID) => variants.filter((v) => v.product === productId),
        [variants]
    );

    useEffect(() => {
        fetchVariants();
    }, [fetchVariants]);

    return {
        variants,
        loading,
        error,
        fetchVariants,
        createVariant,
        updateVariant,
        deleteVariant,
        variantsForProduct,
    };
}

/* -------------------------------------------------------------------------- */
/*  Public / guest-facing reads                                               */
/*  (AllowAny endpoints — no auth token required, safe for the storefront)    */
/* -------------------------------------------------------------------------- */

export function usePublicCategories() {
    const [categories, setCategories] = useState<CategoryPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<CategoryPayload[]>(
                routes.inventory.publicCategories,
                { skipAuth: true }
            );
            setCategories(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load categories"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, fetchCategories };
}

export function usePublicProducts() {
    const [products, setProducts] = useState<GuestProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<GuestProduct[]>(
                routes.inventory.guestProducts,
                { skipAuth: true }
            );
            setProducts(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load products"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, fetchProducts };
}

export function usePublicProductVariants() {
    const [variants, setVariants] = useState<GuestProductVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVariants = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<GuestProductVariant[]>(
                routes.inventory.guestProductVariants,
                { skipAuth: true }
            );
            setVariants(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load product variants"));
        } finally {
            setLoading(false);
        }
    }, []);

    /** Lowest active selling price for a product, or null if none priced yet. */
    const lowestPriceFor = useCallback(
        (productId: ID): number | null => {
            const prices = variants
                .filter((v) => v.product === productId && v.is_active)
                .map((v) => Number(v.selling_price))
                .filter((n) => !Number.isNaN(n));

            return prices.length ? Math.min(...prices) : null;
        },
        [variants]
    );

    useEffect(() => {
        fetchVariants();
    }, [fetchVariants]);

    return { variants, loading, error, fetchVariants, lowestPriceFor };
}

/* -------------------------------------------------------------------------- */
/*  Combined hook                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Convenience hook that bundles every inventory resource. Individual hooks
 * above can still be imported directly where only one resource is needed
 * (e.g. a standalone Categories page).
 */
export function useInventory() {
    const categoriesApi = useCategories();
    const colorsApi = useColors();
    const sizesApi = useSizes();
    const productsApi = useProducts();
    const variantsApi = useProductVariants();

    return {
        categories: categoriesApi,
        colors: colorsApi,
        sizes: sizesApi,
        products: productsApi,
        variants: variantsApi,
    };
}

export { getErrorMessage };