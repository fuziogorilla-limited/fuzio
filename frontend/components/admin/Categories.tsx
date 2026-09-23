"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { FaPlus, FaPen, FaTrash, FaTimes, FaTags } from "react-icons/fa";

import { useCategories, useColors, useSizes } from "@/hooks/useInventory";
import { mediaUrl } from "@/lib/utils";
import type {
    ID,
    CategoryPayload,
    CategoryCreateInput,
    ColorPayload,
    ColorCreateInput,
    SizePayload,
    SizeCreateInput,
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
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border border-ink/10 bg-paper shadow-xl">
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

function extractErrorMessage(err: unknown, fallback: string): string {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data: unknown }).data;

        if (data && typeof data === "object") {
            const firstValue = Object.values(
                data as Record<string, unknown>
            )[0];

            if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
                return firstValue[0];
            }
        }
    }

    return fallback;
}

type Tab = "categories" | "colors" | "sizes";

const TABS: { key: Tab; label: string }[] = [
    { key: "categories", label: "Categories" },
    { key: "colors", label: "Colors" },
    { key: "sizes", label: "Sizes" },
];

/* -------------------------------------------------------------------------- */
/*  Category form                                                             */
/* -------------------------------------------------------------------------- */

type CategoryFormState = {
    name: string;
    description: string;
    image: File | null;
};

const emptyCategoryForm: CategoryFormState = {
    name: "",
    description: "",
    image: null,
};

function CategoryForm({
    initial,
    onCancel,
    onSubmit,
}: {
    initial: CategoryFormState;
    onCancel: () => void;
    onSubmit: (input: CategoryCreateInput) => Promise<void>;
}) {
    const [form, setForm] = useState<CategoryFormState>(initial);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await onSubmit({
                name: form.name,
                description: form.description,
                ...(form.image ? { image: form.image } : {}),
            });
        } catch (err) {
            setError(extractErrorMessage(err, "Failed to save category"));
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
                <label className={labelClass}>Description</label>
                <textarea
                    rows={3}
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

            <div className="mb-6">
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
                    {saving ? "Saving..." : "Save Category"}
                </button>
            </div>
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/*  Simple name-only form (shared by Color + Size)                            */
/* -------------------------------------------------------------------------- */

function NameForm({
    initialName,
    label,
    onCancel,
    onSubmit,
}: {
    initialName: string;
    label: string;
    onCancel: () => void;
    onSubmit: (name: string) => Promise<void>;
}) {
    const [name, setName] = useState(initialName);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await onSubmit(name);
        } catch (err) {
            setError(extractErrorMessage(err, `Failed to save ${label.toLowerCase()}`));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ErrorBanner message={error} />

            <div className="mb-6">
                <label className={labelClass}>{label} Name</label>
                <input
                    required
                    autoFocus
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    {saving ? "Saving..." : `Save ${label}`}
                </button>
            </div>
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/*  Categories panel                                                          */
/* -------------------------------------------------------------------------- */

function CategoriesPanel() {
    const {
        categories,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    const [modal, setModal] = useState<{
        mode: "create" | "edit";
        category?: CategoryPayload;
    } | null>(null);

    const handleSubmit = async (input: CategoryCreateInput) => {
        if (modal?.mode === "edit" && modal.category) {
            await updateCategory(modal.category.id, input);
        } else {
            await createCategory(input);
        }
        setModal(null);
    };

    const handleDelete = async (category: CategoryPayload) => {
        if (
            !window.confirm(
                `Delete "${category.name}"? Products in this category must be reassigned first.`
            )
        )
            return;

        try {
            await deleteCategory(category.id);
        } catch {
            window.alert(
                "Failed to delete category. It may still have products assigned to it."
            );
        }
    };

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setModal({ mode: "create" })}
                    className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark"
                >
                    <FaPlus size={11} />
                    Add Category
                </button>
            </div>

            <ErrorBanner message={error} />

            <div className="border border-ink/10 bg-paper">
                {loading && (
                    <div className="p-6 text-sm text-steel">
                        Loading categories...
                    </div>
                )}

                {!loading && categories.length === 0 && (
                    <div className="flex flex-col items-center gap-2 p-10 text-center text-steel">
                        <FaTags size={22} />
                        <p className="text-sm">No categories yet.</p>
                    </div>
                )}

                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center gap-4 border-b border-ink/10 p-4 last:border-b-0"
                    >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-ink/5">
                            {category.image ? (
                                <Image
                                    src={mediaUrl(category.image)!}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-steel">
                                    <FaTags size={14} />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-black text-ink">
                                    {category.name}
                                </h3>

                                <span
                                    className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                                        category.is_active
                                            ? "bg-ink/10 text-ink"
                                            : "bg-red-500/10 text-red-600"
                                    }`}
                                >
                                    {category.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>

                            {category.description && (
                                <p className="mt-0.5 truncate text-[12px] text-steel">
                                    {category.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setModal({ mode: "edit", category })
                                }
                                className="border border-ink/15 p-2 text-steel transition-colors hover:border-ink hover:text-ink"
                                aria-label="Edit category"
                            >
                                <FaPen size={12} />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(category)}
                                className="border border-ink/15 p-2 text-steel transition-colors hover:border-red-500 hover:text-red-600"
                                aria-label="Delete category"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal
                    title={
                        modal.mode === "edit"
                            ? "Edit Category"
                            : "Add Category"
                    }
                    onClose={() => setModal(null)}
                >
                    <CategoryForm
                        initial={
                            modal.mode === "edit" && modal.category
                                ? {
                                      name: modal.category.name,
                                      description:
                                          modal.category.description,
                                      image: null,
                                  }
                                : emptyCategoryForm
                        }
                        onCancel={() => setModal(null)}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Colors panel                                                              */
/* -------------------------------------------------------------------------- */

function ColorsPanel() {
    const { colors, loading, error, createColor, updateColor, deleteColor } =
        useColors();

    const [modal, setModal] = useState<{
        mode: "create" | "edit";
        color?: ColorPayload;
    } | null>(null);

    const handleSubmit = async (name: string) => {
        const input: ColorCreateInput = { name };

        if (modal?.mode === "edit" && modal.color) {
            await updateColor(modal.color.id, input);
        } else {
            await createColor(input);
        }
        setModal(null);
    };

    const handleDelete = async (color: ColorPayload) => {
        if (!window.confirm(`Delete color "${color.name}"?`)) return;

        try {
            await deleteColor(color.id);
        } catch {
            window.alert(
                "Failed to delete color. It may still be used by a product variant."
            );
        }
    };

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setModal({ mode: "create" })}
                    className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark"
                >
                    <FaPlus size={11} />
                    Add Color
                </button>
            </div>

            <ErrorBanner message={error} />

            <div className="border border-ink/10 bg-paper">
                {loading && (
                    <div className="p-6 text-sm text-steel">
                        Loading colors...
                    </div>
                )}

                {!loading && colors.length === 0 && (
                    <div className="p-10 text-center text-sm text-steel">
                        No colors yet.
                    </div>
                )}

                {colors.map((color) => (
                    <div
                        key={color.id}
                        className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-3 last:border-b-0"
                    >
                        <span className="text-sm font-bold text-ink">
                            {color.name}
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setModal({ mode: "edit", color })
                                }
                                className="border border-ink/15 p-2 text-steel transition-colors hover:border-ink hover:text-ink"
                                aria-label="Edit color"
                            >
                                <FaPen size={12} />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(color)}
                                className="border border-ink/15 p-2 text-steel transition-colors hover:border-red-500 hover:text-red-600"
                                aria-label="Delete color"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal
                    title={
                        modal.mode === "edit" ? "Edit Color" : "Add Color"
                    }
                    onClose={() => setModal(null)}
                >
                    <NameForm
                        initialName={modal.color?.name ?? ""}
                        label="Color"
                        onCancel={() => setModal(null)}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Sizes panel                                                               */
/* -------------------------------------------------------------------------- */

function SizesPanel() {
    const { sizes, loading, error, createSize, updateSize, deleteSize } =
        useSizes();

    const [modal, setModal] = useState<{
        mode: "create" | "edit";
        size?: SizePayload;
    } | null>(null);

    const handleSubmit = async (name: string) => {
        const input: SizeCreateInput = { name };

        if (modal?.mode === "edit" && modal.size) {
            await updateSize(modal.size.id, input);
        } else {
            await createSize(input);
        }
        setModal(null);
    };

    const handleDelete = async (size: SizePayload) => {
        if (!window.confirm(`Delete size "${size.name}"?`)) return;

        try {
            await deleteSize(size.id);
        } catch {
            window.alert(
                "Failed to delete size. It may still be used by a product variant."
            );
        }
    };

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setModal({ mode: "create" })}
                    className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark"
                >
                    <FaPlus size={11} />
                    Add Size
                </button>
            </div>

            <ErrorBanner message={error} />

            <div className="border border-ink/10 bg-paper">
                {loading && (
                    <div className="p-6 text-sm text-steel">
                        Loading sizes...
                    </div>
                )}

                {!loading && sizes.length === 0 && (
                    <div className="p-10 text-center text-sm text-steel">
                        No sizes yet.
                    </div>
                )}

                {sizes.map((size) => (
                    <div
                        key={size.id}
                        className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-3 last:border-b-0"
                    >
                        <span className="text-sm font-bold text-ink">
                            {size.name}
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setModal({ mode: "edit", size })
                                }
                                className="border border-ink/15 p-2 text-steel transition-colors hover:border-ink hover:text-ink"
                                aria-label="Edit size"
                            >
                                <FaPen size={12} />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(size)}
                                className="border border-ink/15 p-2 text-steel transition-colors hover:border-red-500 hover:text-red-600"
                                aria-label="Delete size"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal
                    title={modal.mode === "edit" ? "Edit Size" : "Add Size"}
                    onClose={() => setModal(null)}
                >
                    <NameForm
                        initialName={modal.size?.name ?? ""}
                        label="Size"
                        onCancel={() => setModal(null)}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function Category() {
    const [tab, setTab] = useState<Tab>("categories");

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-[1240px]">
                {/* Header */}
                <div className="mb-6">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                        Inventory
                    </div>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-ink">
                        Categories, Colors &amp; Sizes
                    </h1>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-1 border-b border-ink/10">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-wide transition-colors ${
                                tab === t.key
                                    ? "border-b-2 border-accent text-ink"
                                    : "text-steel hover:text-ink"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "categories" && <CategoriesPanel />}
                {tab === "colors" && <ColorsPanel />}
                {tab === "sizes" && <SizesPanel />}
            </div>
        </div>
    );
}