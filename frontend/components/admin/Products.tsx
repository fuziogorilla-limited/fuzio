"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
    FaPlus,
    FaPen,
    FaTrash,
    FaTimes,
    FaChevronDown,
    FaChevronRight,
    FaBoxOpen,
} from "react-icons/fa";

import {
    useProducts,
    useProductVariants,
    useCategories,
    useColors,
    useSizes,
} from "@/hooks/useInventory";
import { mediaUrl, formatPrice } from "@/lib/utils";
import type {
    ID,
    ProductPayload,
    ProductCreateInput,
    ProductVariantPayload,
    ProductVariantCreateInput,
} from "@/types/inventory";

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

const inputClass =
    "w-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

const labelClass =
    "mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-steel";

function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-8">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-ink/10 bg-paper shadow-xl">
                <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                    <h3 className="text-base font-black uppercase tracking-tight text-ink">
                        {title}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-steel transition-colors hover:text-ink"
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

function ErrorBanner({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="mb-4 border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-semibold text-red-700">
            {message}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Product form                                                              */
/* -------------------------------------------------------------------------- */

type ProductFormState = {
    name: string;
    category: ID | "";
    description: string;
    feature: boolean;
    is_active: boolean;
    image: File | null;
};

const emptyProductForm: ProductFormState = {
    name: "",
    category: "",
    description: "",
    feature: false,
    is_active: true,
    image: null,
};

function ProductForm({
    initial,
    categories,
    onCancel,
    onSubmit,
}: {
    initial: ProductFormState;
    categories: { id: ID; name: string }[];
    onCancel: () => void;
    onSubmit: (input: ProductCreateInput) => Promise<void>;
}) {
    const [form, setForm] = useState<ProductFormState>(initial);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!form.category) {
            setError("Please select a category");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await onSubmit({
                name: form.name,
                category: form.category as ID,
                description: form.description,
                feature: form.feature,
                is_active: form.is_active,
                ...(form.image ? { image: form.image } : {}),
            });
        } catch (err) {
            setError(
                err && typeof err === "object" && "data" in err
                    ? JSON.stringify((err as { data: unknown }).data)
                    : "Failed to save product"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ErrorBanner message={error} />

            <div className="mb-4">
                <label className={labelClass}>Name</label>
                <input
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                    }
                />
            </div>

            <div className="mb-4">
                <label className={labelClass}>Category</label>
                <select
                    required
                    className={inputClass}
                    value={form.category}
                    onChange={(e) =>
                        setForm((f) => ({
                            ...f,
                            category: Number(e.target.value) as ID,
                        }))
                    }
                >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className={labelClass}>Description</label>
                <textarea
                    required
                    maxLength={250}
                    rows={4}
                    className={inputClass}
                    value={form.description}
                    onChange={(e) =>
                        setForm((f) => ({
                            ...f,
                            description: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="mb-4">
                <label className={labelClass}>Image</label>
                <input
                    type="file"
                    accept="image/*"
                    className={inputClass}
                    onChange={(e) =>
                        setForm((f) => ({
                            ...f,
                            image: e.target.files?.[0] ?? null,
                        }))
                    }
                />
            </div>

            <div className="mb-6 flex gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <input
                        type="checkbox"
                        checked={form.feature}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                feature: e.target.checked,
                            }))
                        }
                    />
                    Featured
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                is_active: e.target.checked,
                            }))
                        }
                    />
                    Active
                </label>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border-2 border-ink/15 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Product"}
                </button>
            </div>
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/*  Variant form                                                              */
/* -------------------------------------------------------------------------- */

type VariantFormState = {
    color: ID | "";
    size: ID | "";
    sku: string;
    quantity: number;
    selling_price: string;
    buying_price: string;
    is_active: boolean;
};

const emptyVariantForm: VariantFormState = {
    color: "",
    size: "",
    sku: "",
    quantity: 0,
    selling_price: "",
    buying_price: "",
    // Defaults to Active — the old model default of False meant every new
    // variant was invisible to guests until someone remembered to flip it.
    is_active: true,
};

function VariantForm({
    initial,
    colors,
    sizes,
    onCancel,
    onSubmit,
}: {
    initial: VariantFormState;
    colors: { id: ID; name: string }[];
    sizes: { id: ID; name: string }[];
    onCancel: () => void;
    onSubmit: (
        input: Omit<ProductVariantCreateInput, "product">
    ) => Promise<void>;
}) {
    const [form, setForm] = useState<VariantFormState>(initial);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!form.color || !form.size) {
            setError("Please select a color and size");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await onSubmit({
                color: form.color as ID,
                size: form.size as ID,
                sku: form.sku,
                quantity: Number(form.quantity),
                selling_price: form.selling_price,
                buying_price: form.buying_price,
                is_active: form.is_active,
            });
        } catch (err) {
            setError(
                err && typeof err === "object" && "data" in err
                    ? JSON.stringify((err as { data: unknown }).data)
                    : "Failed to save variant"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ErrorBanner message={error} />

            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Color</label>
                    <select
                        required
                        className={inputClass}
                        value={form.color}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                color: Number(e.target.value) as ID,
                            }))
                        }
                    >
                        <option value="">Select color</option>
                        {colors.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Size</label>
                    <select
                        required
                        className={inputClass}
                        value={form.size}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                size: Number(e.target.value) as ID,
                            }))
                        }
                    >
                        <option value="">Select size</option>
                        {sizes.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className={labelClass}>SKU</label>
                <input
                    required
                    className={inputClass}
                    value={form.sku}
                    onChange={(e) =>
                        setForm((f) => ({ ...f, sku: e.target.value }))
                    }
                />
            </div>

            <div className="mb-4 grid grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Quantity</label>
                    <input
                        required
                        type="number"
                        min={0}
                        className={inputClass}
                        value={form.quantity}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                quantity: Number(e.target.value),
                            }))
                        }
                    />
                </div>

                <div>
                    <label className={labelClass}>Buying Price</label>
                    <input
                        required
                        type="number"
                        min={0}
                        step="0.01"
                        className={inputClass}
                        value={form.buying_price}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                buying_price: e.target.value,
                            }))
                        }
                    />
                </div>

                <div>
                    <label className={labelClass}>Selling Price</label>
                    <input
                        required
                        type="number"
                        min={0}
                        step="0.01"
                        className={inputClass}
                        value={form.selling_price}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                selling_price: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            {/* Status */}
            <div className="mb-6">
                <label className={labelClass}>Status</label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <input
                            type="radio"
                            name="variant-status"
                            checked={form.is_active}
                            onChange={() =>
                                setForm((f) => ({ ...f, is_active: true }))
                            }
                        />
                        Active
                    </label>

                    <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <input
                            type="radio"
                            name="variant-status"
                            checked={!form.is_active}
                            onChange={() =>
                                setForm((f) => ({ ...f, is_active: false }))
                            }
                        />
                        Inactive
                    </label>
                </div>
                <p className="mt-1.5 text-[11.5px] text-steel">
                    Inactive variants are hidden from guests and can&apos;t be
                    ordered, even if the product itself is active.
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border-2 border-ink/15 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Variant"}
                </button>
            </div>
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function AdminProduct() {
    const {
        products,
        loading: productsLoading,
        error: productsError,
        createProduct,
        updateProduct,
        deleteProduct,
    } = useProducts();

    const {
        variants,
        loading: variantsLoading,
        error: variantsError,
        createVariant,
        updateVariant,
        deleteVariant,
        variantsForProduct,
    } = useProductVariants();

    const { categories } = useCategories();
    const { colors } = useColors();
    const { sizes } = useSizes();

    const categoryMap = useMemo(
        () => new Map(categories.map((c) => [c.id, c.name])),
        [categories]
    );

    const [expandedId, setExpandedId] = useState<ID | null>(null);

    const [productModal, setProductModal] = useState<{
        mode: "create" | "edit";
        product?: ProductPayload;
    } | null>(null);

    const [variantModal, setVariantModal] = useState<{
        productId: ID;
        mode: "create" | "edit";
        variant?: ProductVariantPayload;
    } | null>(null);

    const toggleExpand = (id: ID) =>
        setExpandedId((prev) => (prev === id ? null : id));

    /* ---------------------------- Product actions ---------------------------- */

    const handleProductSubmit = async (input: ProductCreateInput) => {
        if (productModal?.mode === "edit" && productModal.product) {
            await updateProduct(productModal.product.id, input);
        } else {
            await createProduct(input);
        }
        setProductModal(null);
    };

    const handleDeleteProduct = async (product: ProductPayload) => {
        if (
            !window.confirm(
                `Delete "${product.name}"? This also removes its variants.`
            )
        )
            return;

        try {
            await deleteProduct(product.id);
        } catch {
            window.alert("Failed to delete product.");
        }
    };

    /* ---------------------------- Variant actions ---------------------------- */

    const handleVariantSubmit = async (
        input: Omit<ProductVariantCreateInput, "product">
    ) => {
        if (!variantModal) return;

        if (variantModal.mode === "edit" && variantModal.variant) {
            await updateVariant(variantModal.variant.id, input);
        } else {
            await createVariant({
                ...input,
                product: variantModal.productId,
            });
        }
        setVariantModal(null);
    };

    const handleDeleteVariant = async (variant: ProductVariantPayload) => {
        if (!window.confirm(`Delete variant "${variant.sku}"?`)) return;

        try {
            await deleteVariant(variant.id);
        } catch {
            window.alert("Failed to delete variant.");
        }
    };

    /* --------------------------------- UI ------------------------------------ */

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-[1240px]">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                            Inventory
                        </div>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-ink">
                            Products
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setProductModal({ mode: "create" })}
                        className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark"
                    >
                        <FaPlus size={11} />
                        Add Product
                    </button>
                </div>

                <ErrorBanner message={productsError} />
                <ErrorBanner message={variantsError} />

                {/* Products list */}
                <div className="border border-ink/10 bg-paper">
                    {productsLoading && (
                        <div className="p-6 text-sm text-steel">
                            Loading products...
                        </div>
                    )}

                    {!productsLoading && products.length === 0 && (
                        <div className="flex flex-col items-center gap-2 p-10 text-center text-steel">
                            <FaBoxOpen size={22} />
                            <p className="text-sm">No products yet.</p>
                        </div>
                    )}

                    {products.map((product) => {
                        const isExpanded = expandedId === product.id;
                        const productVariants = variantsForProduct(
                            product.id
                        );

                        return (
                            <div
                                key={product.id}
                                className="border-b border-ink/10 last:border-b-0"
                            >
                                {/* Product row */}
                                <div className="flex items-center gap-4 p-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleExpand(product.id)
                                        }
                                        className="text-steel transition-colors hover:text-ink"
                                        aria-label="Toggle variants"
                                    >
                                        {isExpanded ? (
                                            <FaChevronDown size={12} />
                                        ) : (
                                            <FaChevronRight size={12} />
                                        )}
                                    </button>

                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-ink/5">
                                        {product.image ? (
                                            <Image
                                                src={mediaUrl(product.image)!}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-steel">
                                                <FaBoxOpen size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="truncate text-sm font-black text-ink">
                                                {product.name}
                                            </h3>

                                            {product.feature && (
                                                <span className="bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
                                                    Featured
                                                </span>
                                            )}

                                            <span
                                                className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                                                    product.is_active
                                                        ? "bg-ink/10 text-ink"
                                                        : "bg-red-500/10 text-red-600"
                                                }`}
                                            >
                                                {product.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>

                                        <p className="mt-0.5 text-[12px] text-steel">
                                            {categoryMap.get(
                                                product.category
                                            ) ?? "Uncategorized"}{" "}
                                            &middot; {productVariants.length}{" "}
                                            variant
                                            {productVariants.length === 1
                                                ? ""
                                                : "s"}
                                        </p>
                                    </div>

                                    <div className="flex flex-shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProductModal({
                                                    mode: "edit",
                                                    product,
                                                })
                                            }
                                            className="border border-ink/15 p-2 text-steel transition-colors hover:border-ink hover:text-ink"
                                            aria-label="Edit product"
                                        >
                                            <FaPen size={12} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteProduct(product)
                                            }
                                            className="border border-ink/15 p-2 text-steel transition-colors hover:border-red-500 hover:text-red-600"
                                            aria-label="Delete product"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* Variants panel */}
                                {isExpanded && (
                                    <div className="border-t border-ink/10 bg-ink/[0.02] px-4 pb-4 pt-3 sm:px-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-steel">
                                                Variants
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setVariantModal({
                                                        productId:
                                                            product.id,
                                                        mode: "create",
                                                    })
                                                }
                                                className="inline-flex items-center gap-1.5 border-2 border-ink/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
                                            >
                                                <FaPlus size={9} />
                                                Add Variant
                                            </button>
                                        </div>

                                        {variantsLoading && (
                                            <p className="text-[13px] text-steel">
                                                Loading variants...
                                            </p>
                                        )}

                                        {!variantsLoading &&
                                            productVariants.length === 0 && (
                                                <p className="text-[13px] text-steel">
                                                    No variants for this
                                                    product yet.
                                                </p>
                                            )}

                                        {productVariants.length > 0 && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[600px] border-collapse text-left text-[13px]">
                                                    <thead>
                                                        <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                                                            <th className="py-2 pr-3">
                                                                SKU
                                                            </th>
                                                            <th className="py-2 pr-3">
                                                                Color
                                                            </th>
                                                            <th className="py-2 pr-3">
                                                                Size
                                                            </th>
                                                            <th className="py-2 pr-3">
                                                                Qty
                                                            </th>
                                                            <th className="py-2 pr-3">
                                                                Buying
                                                            </th>
                                                            <th className="py-2 pr-3">
                                                                Selling
                                                            </th>
                                                            <th className="py-2 pr-3">
                                                                Status
                                                            </th>
                                                            <th className="py-2 pr-3 text-right">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {productVariants.map(
                                                            (variant) => (
                                                                <tr
                                                                    key={
                                                                        variant.id
                                                                    }
                                                                    className="border-b border-ink/5 last:border-b-0"
                                                                >
                                                                    <td className="py-2.5 pr-3 font-semibold text-ink">
                                                                        {
                                                                            variant.sku
                                                                        }
                                                                    </td>
                                                                    <td className="py-2.5 pr-3 text-steel">
                                                                        {colors.find(
                                                                            (
                                                                                c
                                                                            ) =>
                                                                                c.id ===
                                                                                variant.color
                                                                        )
                                                                            ?.name ??
                                                                            "-"}
                                                                    </td>
                                                                    <td className="py-2.5 pr-3 text-steel">
                                                                        {sizes.find(
                                                                            (
                                                                                s
                                                                            ) =>
                                                                                s.id ===
                                                                                variant.size
                                                                        )
                                                                            ?.name ??
                                                                            "-"}
                                                                    </td>
                                                                    <td className="py-2.5 pr-3 text-steel">
                                                                        {
                                                                            variant.quantity
                                                                        }
                                                                    </td>
                                                                    <td className="py-2.5 pr-3 text-steel">
                                                                        {formatPrice(
                                                                            variant.buying_price
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2.5 pr-3 font-semibold text-ink">
                                                                        {formatPrice(
                                                                            variant.selling_price
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2.5 pr-3">
                                                                        <span
                                                                            className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                                                                                variant.is_active
                                                                                    ? "bg-ink/10 text-ink"
                                                                                    : "bg-red-500/10 text-red-600"
                                                                            }`}
                                                                        >
                                                                            {variant.is_active
                                                                                ? "Active"
                                                                                : "Inactive"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2.5 pr-3">
                                                                        <div className="flex justify-end gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setVariantModal(
                                                                                        {
                                                                                            productId:
                                                                                                product.id,
                                                                                            mode: "edit",
                                                                                            variant,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="border border-ink/15 p-1.5 text-steel transition-colors hover:border-ink hover:text-ink"
                                                                                aria-label="Edit variant"
                                                                            >
                                                                                <FaPen
                                                                                    size={
                                                                                        10
                                                                                    }
                                                                                />
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDeleteVariant(
                                                                                        variant
                                                                                    )
                                                                                }
                                                                                className="border border-ink/15 p-1.5 text-steel transition-colors hover:border-red-500 hover:text-red-600"
                                                                                aria-label="Delete variant"
                                                                            >
                                                                                <FaTrash
                                                                                    size={
                                                                                        10
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Product modal */}
            {productModal && (
                <Modal
                    title={
                        productModal.mode === "edit"
                            ? "Edit Product"
                            : "Add Product"
                    }
                    onClose={() => setProductModal(null)}
                >
                    <ProductForm
                        initial={
                            productModal.mode === "edit" &&
                            productModal.product
                                ? {
                                      name: productModal.product.name,
                                      category: productModal.product.category,
                                      description:
                                          productModal.product.description,
                                      feature: productModal.product.feature,
                                      is_active:
                                          productModal.product.is_active,
                                      image: null,
                                  }
                                : emptyProductForm
                        }
                        categories={categories}
                        onCancel={() => setProductModal(null)}
                        onSubmit={handleProductSubmit}
                    />
                </Modal>
            )}

            {/* Variant modal */}
            {variantModal && (
                <Modal
                    title={
                        variantModal.mode === "edit"
                            ? "Edit Variant"
                            : "Add Variant"
                    }
                    onClose={() => setVariantModal(null)}
                >
                    <VariantForm
                        initial={
                            variantModal.mode === "edit" &&
                            variantModal.variant
                                ? {
                                      color: variantModal.variant.color,
                                      size: variantModal.variant.size,
                                      sku: variantModal.variant.sku,
                                      quantity:
                                          variantModal.variant.quantity,
                                      selling_price:
                                          variantModal.variant.selling_price,
                                      buying_price:
                                          variantModal.variant.buying_price,
                                      is_active:
                                          variantModal.variant.is_active,
                                  }
                                : emptyVariantForm
                        }
                        colors={colors}
                        sizes={sizes}
                        onCancel={() => setVariantModal(null)}
                        onSubmit={handleVariantSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}