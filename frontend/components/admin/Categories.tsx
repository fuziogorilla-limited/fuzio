"use client";

import { useEffect, useState, FormEvent } from "react";
import { FaPlus, FaEdit, FaTrash, FaThLarge, FaTimes, FaSpinner } from "react-icons/fa";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

// Mirrors the actual Django Category model / CategorySerializer.
// NOTE: there is no "icon" field on the backend — only name, description,
// image (file upload) and is_active. Image upload isn't wired up here since
// apiFetch always JSON.stringifies the body; uploading `image` needs a
// multipart/form-data request (a separate helper, or an apiFetch variant
// that skips JSON.stringify when passed a FormData body).
type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
  date_added: string;
};

type CategoryDraft = {
  name: string;
  description: string;
  is_active: boolean;
};

const EMPTY_DRAFT: CategoryDraft = { name: "", description: "", is_active: true };

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

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<CategoryDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Category[]>(routes.inventory.categories)
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(extractErrorMessage(err, "Couldn't load categories right now."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setModalMode("edit");
    setEditingId(c.id);
    setDraft({ name: c.name, description: c.description, is_active: c.is_active });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (modalMode === "add") {
        const created = await apiFetch<{ message: string; category: Category }>(
          routes.inventory.categories,
          { method: "POST", body: draft }
        );
        setCategories((prev) => [created.category, ...prev]);
      } else if (editingId !== null) {
        await apiFetch<{ message: string; category: Category }>(routes.inventory.category(editingId), {
          method: "PATCH",
          body: draft,
        });
        setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...draft } : c)));
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't save this category. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? Products in this category won't be deleted.`)) return;
    setDeletingId(id);
    try {
      await apiFetch(routes.inventory.category(id), { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't delete this category. Please try again."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Toolbar */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-[12.5px] text-steel">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </span>
        <button
          onClick={openAddModal}
          className="flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink"
        >
          <FaPlus size={11} /> Add Category
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-3 h-12 w-full animate-pulse bg-bg last:mb-0" />
            ))}
          </div>
        )}

        {!loading && !loadError && categories.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No categories yet. Add your first one above.</p>
        )}

        {!loading && !loadError && categories.length > 0 && (
          <ul>
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-3 border-b border-ink/5 px-4 py-3 last:border-none sm:px-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-2 text-steel-light">
                  <FaThLarge size={15} />
                </div>
                <span className="min-w-0 shrink-0 basis-[160px] truncate text-[13.5px] font-bold">{c.name}</span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-steel">{c.description}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
                    c.is_active ? "bg-green/15 text-green" : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.is_active ? "Active" : "Inactive"}
                </span>
                <div className="ml-auto flex shrink-0 gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    aria-label={`Edit ${c.name}`}
                    className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    disabled={deletingId === c.id}
                    aria-label={`Delete ${c.name}`}
                    className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-accent-dark hover:text-accent-dark disabled:opacity-50"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 px-4"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] border border-ink/10 bg-paper"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h3 className="text-[15px] font-extrabold text-ink">
                {modalMode === "add" ? "Add Category" : "Edit Category"}
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
                  placeholder="e.g. Workwear"
                  className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                />
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

              <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={draft.is_active}
                  onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                />
                Active (visible on storefront)
              </label>

              <p className="text-[11.5px] text-steel">
                Image upload isn&apos;t available here yet — add it via the Django admin for now.
              </p>

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
                  {saving ? "Saving…" : modalMode === "add" ? "Add Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}