"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaBoxOpen } from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { CATEGORY_SORT_OPTIONS } from "@/constants/category";
import { useCategoryData } from "@/hooks/useCategoryData";
import { formatPrice, mediaUrl } from "@/lib/utils";
import type { SortOption } from "@/types/fields";
import { useState } from "react";

export default function Category() {
  const params = useParams();

  const categoryId = Number(params.id);

  const { addToCart } = useCart();

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
      return (
        Number(a.selling_price) -
        Number(b.selling_price)
      );
    }

    if (sort === "high") {
      return (
        Number(b.selling_price) -
        Number(a.selling_price)
      );
    }

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
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Category
            </h1>
          ) : (
            <>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                {category?.name ?? "Category"}
              </h1>

              {category?.description && (
                <p className="mt-1.5 max-w-xl text-sm text-steel-light">
                  {category.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Products */}
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          {/* Breadcrumb */}
          <div className="mb-5 text-xs font-semibold text-steel">
            <Link
              href="/"
              className="transition-colors hover:text-accent-dark"
            >
              Home
            </Link>

            <span className="mx-1.5 opacity-50">
              /
            </span>

            <span>
              {category?.name ?? "Category"}
            </span>
          </div>

          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
            <div className="text-sm font-semibold text-steel">
              {prodLoading
                ? "Loading products…"
                : `${sortedProducts.length} product${
                    sortedProducts.length === 1
                      ? ""
                      : "s"
                  }`}
            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value as SortOption
                )
              }
              className="border border-ink/15 bg-paper px-3 py-2.5 font-sans text-[12.5px] font-semibold"
              aria-label="Sort products"
            >
              {CATEGORY_SORT_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Loading state */}
          {prodLoading && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] w-full animate-pulse border border-ink/10 bg-paper"
                  />
                )
              )}
            </div>
          )}

          {/* Error state */}
          {!prodLoading && prodError && (
            <p className="py-10 text-center text-sm text-steel">
              Couldn&apos;t load products right now.
              Please try again shortly.
            </p>
          )}

          {/* Empty state */}
          {!prodLoading &&
            !prodError &&
            sortedProducts.length === 0 && (
              <p className="py-10 text-center text-sm text-steel">
                No products found in this category
                yet.
              </p>
            )}

          {/* Product grid */}
          {!prodLoading &&
            !prodError &&
            sortedProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {sortedProducts.map((product) => {
                  const image = mediaUrl(
                    product.image ?? null
                  );

                  return (
                    <div
                      key={product.id}
                      className="flex min-w-0 flex-col border border-ink/10 bg-paper transition-transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Product image */}
                      <Link
                        href={`/product/${product.id}`}
                        className="block"
                      >
                        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-ink-2">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaBoxOpen className="text-3xl text-steel-light sm:text-4xl" />
                          )}

                          <span className="absolute left-2 top-2 bg-paper px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wide text-green">
                            In Stock
                          </span>
                        </div>
                      </Link>

                      {/* Product details */}
                      <div className="flex flex-1 flex-col p-3.5">
                        <Link
                          href={`/product/${product.id}`}
                          className="mb-1 line-clamp-2 text-sm font-bold leading-snug"
                        >
                          {product.name}
                        </Link>

                        <p className="mb-2.5 line-clamp-2 text-[11px] leading-relaxed text-steel">
                          {product.description}
                        </p>

                        <div className="mt-auto font-mono text-[15px] font-bold">
                          {formatPrice(
                            product.selling_price
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const variant = product.variants[0];
                            if (!variant) return;

                            addToCart({
                              pid: String(variant.id),
                              name: product.name,
                              price: Number(product.selling_price),
                              size: variant.size,
                              color: variant.color,
                            });
                          }}
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