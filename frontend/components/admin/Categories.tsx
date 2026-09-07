"use client";

import { useEffect, useState, FormEvent } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

// TODO: replace with your real backend base URL
const API_BASE = "https://api.example.com";

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [newCategory, setNewCategory] = useState({ name: "", icon: "", description: "" });
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ name: "", icon: "", description: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/admin/categories`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data: Category[]) => {
        if (!cancelled) setCategories(data);
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

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.icon.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) throw new Error("Failed to add category");
      const created: Category = await res.json();
      setCategories((prev) => [created, ...prev]);
      setNewCategory({ name: "", icon: "", description: "" });
    } catch {
      alert("Couldn't add that category. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditDraft({ name: c.name, icon: c.icon, description: c.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!editDraft.name.trim() || !editDraft.icon.trim()) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(editDraft),
      });
      if (!res.ok) throw new Error("Failed to update category");
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...editDraft } : c)));
      setEditingId(null);
    } catch {
      alert("Couldn't save changes. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? Products in this category won't be deleted.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Couldn't delete this category. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Add category */}
      <form
        onSubmit={handleAdd}
        className="mb-6 flex flex-col gap-3 border border-ink/10 bg-paper p-4 sm:flex-row sm:items-end"
      >
        <div className="w-full sm:w-20">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">Icon</label>
          <input
            type="text"
            value={newCategory.icon}
            onChange={(e) => setNewCategory((c) => ({ ...c, icon: e.target.value }))}
            placeholder="🦺"
            maxLength={4}
            className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-center text-[15px] outline-none focus:border-ink"
          />
        </div>
        <div className="w-full flex-1">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">Name</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory((c) => ({ ...c, name: e.target.value }))}
            placeholder="e.g. Workwear"
            className="w-full min-w-0 border border-ink/15 bg-paper px-3 py-2.5 text-[13px] outline-none focus:border-ink"
          />
        </div>
        <div className="w-full flex-[2]">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
            Description
          </label>
          <input
            type="text"
            value={newCategory.description}
            onChange={(e) => setNewCategory((c) => ({ ...c, description: e.target.value }))}
            placeholder="Short description shown on the storefront"
            className="w-full min-w-0 border border-ink/15 bg-paper px-3 py-2.5 text-[13px] outline-none focus:border-ink"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="flex shrink-0 items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink disabled:opacity-60"
        >
          <FaPlus size={11} /> Add
        </button>
      </form>

      {error && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          Couldn&apos;t load categories right now. Please try again shortly.
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

        {!loading && !error && categories.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No categories yet. Add your first one above.</p>
        )}

        {!loading && !error && categories.length > 0 && (
          <ul>
            {categories.map((c) => {
              const isEditing = editingId === c.id;
              return (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-3 border-b border-ink/5 px-4 py-3 last:border-none sm:px-5"
                >
                  {isEditing ? (
                    <>
                      <input
                        value={editDraft.icon}
                        onChange={(e) => setEditDraft((d) => ({ ...d, icon: e.target.value }))}
                        maxLength={4}
                        className="w-14 shrink-0 border border-ink/15 bg-paper px-2 py-1.5 text-center text-[15px] outline-none focus:border-ink"
                      />
                      <input
                        value={editDraft.name}
                        onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                        className="min-w-0 flex-1 border border-ink/15 bg-paper px-2.5 py-1.5 text-[13px] font-semibold outline-none focus:border-ink sm:flex-[1.2]"
                      />
                      <input
                        value={editDraft.description}
                        onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                        className="min-w-0 flex-[2] border border-ink/15 bg-paper px-2.5 py-1.5 text-[13px] text-steel outline-none focus:border-ink"
                      />
                      <div className="ml-auto flex shrink-0 gap-2">
                        <button
                          onClick={() => saveEdit(c.id)}
                          disabled={savingEdit}
                          aria-label="Save"
                          className="flex h-8 w-8 items-center justify-center border border-green text-green hover:bg-green hover:text-white disabled:opacity-50"
                        >
                          <FaCheck size={12} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          aria-label="Cancel"
                          className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                        >
                          <FaTimes size={13} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-2 text-lg">
                        {c.icon}
                      </div>
                      <span className="min-w-0 shrink-0 basis-[160px] truncate text-[13.5px] font-bold">
                        {c.name}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-steel">{c.description}</span>
                      <div className="ml-auto flex shrink-0 gap-2">
                        <button
                          onClick={() => startEdit(c)}
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
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}