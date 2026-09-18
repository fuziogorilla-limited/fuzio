"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowRight, FaBoxOpen } from "react-icons/fa";

import { useCategoryData } from "@/hooks/useCategories";
import { formatPrice, mediaUrl } from "@/lib/utils";
import type { SortOption } from "@/types/fields";

const CATEGORY_SORT_OPTIONS = [
  { value: "default", label: "Sort: Featured" },
  { value: "low", label: "Price: Low to High" },
  { value: "high", label: "Price: High to Low" },
] as const;

export default function Category() {
  const params = useParams();

  const categoryId = Number(params.id);

  const {
    category,
    catLoading,
    catError,
    products,
    prodLoading,
    prodError,
  } = useCategoryData(categoryId);

  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") {
      return Number(a.selling_price) - Number(b.selling_price);
    }

    if (sort === "high") {
      return Number(b.selling_price) - Number(a.selling_price);
    }

    return 0;
  });

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      {/* =========================================================
          CATEGORY HERO
      ========================================================== */}
      <section className="bg-ink px-4 py-7 text-paper sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Category
          </div>

          {catLoading && (
            <>
              <div className="mt-2 h-8 w-64 max-w-full animate-pulse bg-white/10" />

              <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-white/10" />
            </>
          )}

          {!catLoading && catError && (
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Category
            </h1>
          )}

          {!catLoading && !catError && (
            <>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                {category?.name ?? "Category"}
              </h1>

              {category?.description && (
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-steel-light">
                  {category.description}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================
          PRODUCTS
      ========================================================== */}
      <section className="bg-bg px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          {/* =====================================================
              BREADCRUMB
          ====================================================== */}
          <div className="mb-5 flex items-center text-xs font-semibold text-steel">
            <Link
              href="/"
              className="transition-colors hover:text-accent-dark"
            >
              Home
            </Link>

            <span className="mx-1.5 opacity-50">/</span>

            <span>{category?.name ?? "Category"}</span>
          </div>

          {/* =====================================================
              TOOLBAR
          ====================================================== */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
            <div className="text-sm font-semibold text-steel">
              {prodLoading
                ? "Loading products…"
                : `${sortedProducts.length} product${
                    sortedProducts.length === 1 ? "" : "s"
                  }`}
            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              className="border border-ink/15 bg-paper px-3 py-2.5 font-sans text-[12.5px] font-semibold text-ink outline-none transition-colors focus:border-accent"
              aria-label="Sort products"
            >
              {CATEGORY_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* =====================================================
              LOADING STATE
          ====================================================== */}
          {prodLoading && (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden border border-ink/10 bg-paper"
                >
                  <div className="aspect-square animate-pulse bg-ink-2" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-full animate-pulse bg-ink/10" />

                    <div className="h-8 w-2/3 animate-pulse bg-ink/10" />

                    <div className="h-5 w-24 animate-pulse bg-ink/10" />

                    <div className="h-9 w-full animate-pulse bg-ink/10" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =====================================================
              ERROR STATE
          ====================================================== */}
          {!prodLoading && prodError && (
            <div className="border border-ink/10 bg-paper p-8 text-center">
              <p className="text-sm font-semibold text-steel">
                Couldn&apos;t load products right now.
              </p>

              <p className="mt-2 text-xs text-steel">
                Please try again shortly.
              </p>
            </div>
          )}

          {/* =====================================================
              EMPTY STATE
          ====================================================== */}
          {!prodLoading &&
            !prodError &&
            sortedProducts.length === 0 && (
              <div className="border border-ink/10 bg-paper p-8 text-center">
                <p className="text-sm font-semibold text-steel">
                  No products found in this category yet.
                </p>
              </div>
            )}

          {/* =====================================================
              PRODUCT GRID
          ====================================================== */}
          {!prodLoading &&
            !prodError &&
            sortedProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                {sortedProducts.map((product) => {
                  const image = mediaUrl(product.image ?? null);

                  return (
                    <article
                      key={product.id}
                      className="group flex min-w-0 flex-col overflow-hidden border border-ink/10 bg-paper transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_10px_22px_rgba(21,20,15,0.10)]"
                    >
                      {/* =================================================
                          PRODUCT IMAGE
                      ================================================== */}
                      <Link
                        href={`/product/${product.id}`}
                        className="relative block aspect-square overflow-hidden bg-ink-2"
                        aria-label={`View ${product.name}`}
                      >
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaBoxOpen
                              size={42}
                              className="text-paper/70"
                            />
                          </div>
                        )}

                        {/* Stock badge */}
                        <span className="absolute left-2 top-2 bg-paper px-2 py-[3px] font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] text-green">
                          In Stock
                        </span>
                      </Link>

                      {/* =================================================
                          PRODUCT DETAILS
                      ================================================== */}
                      <div className="flex flex-1 flex-col p-[13px_14px_15px]">
                        {/* Product heading */}
                        <Link
                          href={`/product/${product.id}`}
                          className="block"
                        >
                          <h2 className="line-clamp-2 text-[13.5px] font-bold leading-[1.35] text-ink transition-colors group-hover:text-accent-dark">
                            {product.name}
                          </h2>
                        </Link>

                        {/* Product description */}
                        {product.description && (
                          <p className="mt-1.5 mb-2.5 line-clamp-3 text-[11.5px] leading-[1.5] text-steel">
                            {product.description}
                          </p>
                        )}

                        {/* Product price */}
                        <div className="mt-auto pt-2 font-mono text-[14.5px] font-bold text-ink">
                          {formatPrice(product.selling_price)}
                        </div>

                        {/* =================================================
                            VIEW PRODUCT BUTTON
                        ================================================== */}
                        <Link
                          href={`/product/${product.id}`}
                          className="mt-2.5 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-3.5 py-[9px] text-[11px] font-bold uppercase tracking-wide text-paper transition-all duration-150 hover:-translate-y-[1px] hover:border-accent hover:bg-accent hover:text-ink"
                        >
                          View Product

                          <FaArrowRight
                            size={9}
                            className="transition-transform duration-150 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}