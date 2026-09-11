"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
};

type Product = {
  id: number;
  category: number;
  name: string;
  description: string;
  selling_price: string;
  color: string;
  size: string;
  is_active: boolean;
  feature: boolean;
};

function fmt(price: string) {
  return "KES " + Number(price).toLocaleString("en-KE");
}

function mediaUrl(path: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}

type SortOption = "default" | "low" | "high";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Number(params.id);
  const { addToCart } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState(false);

  const [sort, setSort] = useState<SortOption>("default");

  useEffect(() => {
    let cancelled = false;

    // No public "single category" endpoint, so pull the list and find it.
    apiFetch<Category[]>(routes.inventory.publicCategories)
      .then((data) => {
        if (cancelled) return;
        const found = data.find((c) => c.id === categoryId) || null;
        setCategory(found);
      })
      .catch(() => {
        if (!cancelled) setCatError(true);
      })
      .finally(() => {
        if (!cancelled) setCatLoading(false);
      });

    apiFetch<Product[]>(routes.inventory.publicProducts)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.filter((p) => p.category === categoryId && p.is_active));
      })
      .catch(() => {
        if (!cancelled) setProdError(true);
      })
      .finally(() => {
        if (!cancelled) setProdLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return Number(a.selling_price) - Number(b.selling_price);
    if (sort === "high") return Number(b.selling_price) - Number(a.selling_price);
    return 0;
  });

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      {/* Category hero */}
      <div className="bg-ink px-4 py-7 text-paper sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Category
          </div>
          {catLoading ? (
            <>
              <div className="mt-2 h-8 w-64 max-w-full animate-pulse bg-white/10" />
              <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-white/10" />
            </>
          ) : catError ? (
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Category</h1>
          ) : (
            <>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                {category?.name ?? "Category"}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-steel-light">
                {category?.description}
              </p>
            </>
          )}
        </div>
      </div>

      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          {/* Breadcrumb */}
          <div className="mb-5 text-xs font-semibold text-steel">
            <Link href="/" className="hover:text-accent-dark">
              Home
            </Link>
            <span className="mx-1.5 opacity-50">/</span>
            <span>{category?.name ?? "Category"}</span>
          </div>

          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
            <div className="text-sm font-semibold text-steel">
              {prodLoading
                ? "Loading products…"
                : `${sortedProducts.length} product${sortedProducts.length === 1 ? "" : "s"}`}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="border border-ink/15 bg-paper px-3 py-2.5 font-sans text-[12.5px] font-semibold"
            >
              <option value="default">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {/* Product grid */}
          {prodLoading && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] w-full animate-pulse border border-ink/10 bg-paper" />
              ))}
            </div>
          )}

          {!prodLoading && prodError && (
            <p className="py-10 text-center text-sm text-steel">
              Couldn&apos;t load products right now. Please try again shortly.
            </p>
          )}

          {!prodLoading && !prodError && sortedProducts.length === 0 && (
            <p className="py-10 text-center text-sm text-steel">
              No products found in this category yet.
            </p>
          )}

          {!prodLoading && !prodError && sortedProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {sortedProducts.map((p) => {
                const img = mediaUrl((p as unknown as { image?: string | null }).image ?? null);
                return (
                  <div
                    key={p.id}
                    className="flex min-w-0 flex-col border border-ink/10 bg-paper transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/product/${p.id}`} className="block">
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-ink-2">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <FaBoxOpen className="text-3xl text-steel-light sm:text-4xl" />
                        )}
                        <span className="absolute left-2 top-2 bg-paper px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wide text-green">
                          In Stock
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col p-3.5">
                      <Link href={`/product/${p.id}`} className="mb-1 line-clamp-2 text-sm font-bold leading-snug">
                        {p.name}
                      </Link>
                      <p className="mb-2.5 line-clamp-2 text-[11px] leading-relaxed text-steel">
                        {p.description}
                      </p>
                      <div className="mt-auto font-mono text-[15px] font-bold">
                        {fmt(p.selling_price)}
                      </div>
                      <button
                        onClick={() =>
                          addToCart({
                            pid: String(p.id),
                            name: p.name,
                            price: Number(p.selling_price),
                            size: p.size || null,
                            color: p.color || null,
                          })
                        }
                        className="mt-2.5 w-full border-2 border-ink bg-ink py-2 text-[11px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}