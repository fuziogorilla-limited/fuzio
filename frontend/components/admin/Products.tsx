"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

// TODO: replace with your real backend base URL
const API_BASE = "https://api.example.com";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
};

function fmt(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/admin/products`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data: Product[]) => {
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

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Couldn't delete this product. Please try again.");
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
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-ink/15 bg-paper px-3 py-2.5 text-[13px] font-medium outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <Link
          href="/admin/products/new"
          className="ml-auto flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink"
        >
          <FaPlus size={11} /> Add Product
        </Link>
      </div>

      {error && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          Couldn&apos;t load products right now. Please try again shortly.
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

        {!loading && !error && filtered.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No products found.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
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
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-2 text-lg">
                          {p.icon}
                        </div>
                        <span className="max-w-[180px] truncate font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-steel sm:px-5">{p.category}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold sm:px-5">
                      {fmt(p.price)}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
                          p.stock > 0 ? "bg-green/15 text-green" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          aria-label={`Edit ${p.name}`}
                          className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                        >
                          <FaEdit size={13} />
                        </Link>
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
    </div>
  );
}