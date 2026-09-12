"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBoxOpen, FaTimes, FaSpinner } from "react-icons/fa";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

// Mirrors the actual ProductSerializer (fields = "__all__"):
// category is a numeric FK id (not a name), there's no "icon" field,
// and stock is called "quantity" on the backend.
type Product = {
  id: number;
  category: number;
  name: string;
  description: string;
  buying_price: string;
  selling_price: string;
  color: string;
  size: string;
  quantity: number;
  is_active: boolean;
  date_added: string;
  feature: boolean;
};

type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
  date_added: string;
};

type ProductDraft = {
  category: number | "";
  name: string;
  description: string;
  buying_price: string;
  selling_price: string;
  color: string;
  size: string;
  quantity: string;
  is_active: boolean;
  feature: boolean;
};

const EMPTY_DRAFT: ProductDraft = {
  category: "",
  name: "",
  description: "",
  buying_price: "",
  selling_price: "",
  color: "",
  size: "",
  quantity: "",
  is_active: true,
  feature: false,
};

type ApiErrorShape = {
  status?: number;
  data?: Record<string, unknown> | null;
};

function extractErrorMessage(err: unknown, fallback: string): string {
  const apiErr = err as ApiErrorShape;
  if (apiErr?.data) {
    const firstKey = Object.keys(apiErr.data)[0];
    if (firstKey) {
      const val = apiErr.data[firstKey];
      if (Array.isArray(val) && typeof val[0] === "string") return val[0];
      if (typeof val === "string") return val;
    }
  }
  return fallback;
}

function fmt(price: string) {
  return "KES " + Number(price).toLocaleString("en-KE");
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | number>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
        if (!cancelled) setLoadError(extractErrorMessage(err, "Couldn't load products right now."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? "Uncategorised";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT, category: categories[0]?.id ?? "" });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setModalMode("edit");
    setEditingId(p.id);
    setDraft({
      category: p.category,
      name: p.name,
      description: p.description,
      buying_price: p.buying_price,
      selling_price: p.selling_price,
      color: p.color,
      size: p.size,
      quantity: String(p.quantity),
      is_active: p.is_active,
      feature: p.feature,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!draft.name.trim() || draft.category === "") {
      setFormError("Name and category are required.");
      return;
    }
    if (draft.buying_price === "" || draft.selling_price === "" || draft.quantity === "") {
      setFormError("Buying price, selling price and quantity are required.");
      return;
    }

    const payload = {
      category: Number(draft.category),
      name: draft.name,
      description: draft.description,
      buying_price: draft.buying_price,
      selling_price: draft.selling_price,
      color: draft.color,
      size: draft.size,
      quantity: Number(draft.quantity),
      is_active: draft.is_active,
      feature: draft.feature,
    };

    setSaving(true);
    setFormError(null);
    try {
      if (modalMode === "add") {
        const created = await apiFetch<{ message: string; product: Product }>(routes.inventory.products, {
          method: "POST",
          body: payload,
        });
        setProducts((prev) => [created.product, ...prev]);
      } else if (editingId !== null) {
        await apiFetch<{ message: string; product: Product }>(routes.inventory.product(editingId), {
          method: "PATCH",
          body: payload,
        });
        setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't save this product. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await apiFetch(routes.inventory.product(id), { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't delete this product. Please try again."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 border border-ink/15 bg-paper px-3 py-2.5 sm:max-w-[280px]">
          <FaSearch className="shrink-0 text-steel" size={13} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full min-w-0 bg-transparent text-[13px] outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="border border-ink/15 bg-paper px-3 py-2.5 text-[13px] font-medium outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={openAddModal}
          className="ml-auto flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink"
        >
          <FaPlus size={11} /> Add Product
        </button>
      </div>

      {loadError && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {loadError}
        </p>
      )}

      <div className="border border-ink/10 bg-paper">
        {loading && (
          <div className="p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-3 h-12 w-full animate-pulse bg-bg last:mb-0" />
            ))}
          </div>
        )}

        {!loading && !loadError && filtered.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No products found.</p>
        )}

        {!loading && !loadError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-ink/10 text-left text-[11px] font-bold uppercase tracking-wide text-steel">
                  <th className="px-4 py-3 sm:px-5">Product</th>
                  <th className="px-4 py-3 sm:px-5">Category</th>
                  <th className="px-4 py-3 sm:px-5">Price</th>
                  <th className="px-4 py-3 sm:px-5">Stock</th>
                  <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-ink/5 last:border-none hover:bg-bg">
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-2 text-steel-light">
                          <FaBoxOpen size={15} />
                        </div>
                        <span className="max-w-[180px] truncate font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-steel sm:px-5">{categoryName(p.category)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold sm:px-5">
                      {fmt(p.selling_price)}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
                          p.quantity > 0 ? "bg-green/15 text-green" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          aria-label={`Edit ${p.name}`}
                          className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          aria-label={`Delete ${p.name}`}
                          className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-accent-dark hover:text-accent-dark disabled:opacity-50"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/50 px-4 py-8"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] border border-ink/10 bg-paper"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h3 className="text-[15px] font-extrabold text-ink">
                {modalMode === "add" ? "Add Product" : "Edit Product"}
              </h3>
              <button onClick={closeModal} aria-label="Close" className="text-steel hover:text-ink">
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Industrial Overall"
                  className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Category
                </label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: Number(e.target.value) }))}
                  className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Short description shown on the storefront"
                  className="w-full resize-none border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Buying Price (KES)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.buying_price}
                    onChange={(e) => setDraft((d) => ({ ...d, buying_price: e.target.value }))}
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Selling Price (KES)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.selling_price}
                    onChange={(e) => setDraft((d) => ({ ...d, selling_price: e.target.value }))}
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Color
                  </label>
                  <input
                    type="text"
                    value={draft.color}
                    onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                    placeholder="Navy"
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Size
                  </label>
                  <input
                    type="text"
                    value={draft.size}
                    onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))}
                    placeholder="M"
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={draft.quantity}
                    onChange={(e) => setDraft((d) => ({ ...d, quantity: e.target.value }))}
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={draft.is_active}
                    onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                  />
                  Active (visible on storefront)
                </label>
                <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={draft.feature}
                    onChange={(e) => setDraft((d) => ({ ...d, feature: e.target.checked }))}
                  />
                  Featured on homepage
                </label>
              </div>

              {formError && (
                <p className="border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
                  {formError}
                </p>
              )}

              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 border-2 border-ink/15 py-2.5 text-[12px] font-bold uppercase tracking-wide text-steel transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-ink bg-ink py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <FaSpinner className="animate-spin" size={12} />}
                  {saving ? "Saving…" : modalMode === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}