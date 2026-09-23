"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaBoxOpen, FaWhatsapp } from "react-icons/fa";

import {
    usePublicCategories,
    usePublicProducts,
    usePublicProductVariants,
} from "@/hooks/useInventory";
import { formatPrice, mediaUrl, waLink } from "@/lib/utils";

type SortOption = "featured" | "price-low" | "price-high";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Sort: Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

export default function Category({ categoryId }: { categoryId: string }) {
    const id = Number(categoryId);

    const { categories, loading: categoriesLoading } = usePublicCategories();
    const { products, loading: productsLoading } = usePublicProducts();
    const {
        variants,
        loading: variantsLoading,
        lowestPriceFor,
    } = usePublicProductVariants();

    const [sort, setSort] = useState<SortOption>("featured");

    const category = categories.find((c) => c.id === id);
    const loading = categoriesLoading || productsLoading;

    const categoryProducts = useMemo(() => {
        let list = products.filter((p) => p.category === id);

        if (sort === "price-low" || sort === "price-high") {
            list = [...list].sort((a, b) => {
                const priceA =
                    lowestPriceFor(a.id) ?? Number.POSITIVE_INFINITY;
                const priceB =
                    lowestPriceFor(b.id) ?? Number.POSITIVE_INFINITY;

                return sort === "price-low"
                    ? priceA - priceB
                    : priceB - priceA;
            });
        } else {
            // Featured items first; the API already orders the rest by
            // -date_added so newest-within-group stays stable.
            list = [...list].sort(
                (a, b) => Number(b.feature) - Number(a.feature)
            );
        }

        return list;
    }, [products, id, sort, lowestPriceFor]);

    // Only treat as "not found" once categories have actually finished
    // loading — otherwise this flashes on first paint before data arrives.
    if (!categoriesLoading && !category) {
        return (
            <div className="px-4 py-20 text-center sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <FaBoxOpen size={28} className="mx-auto mb-4 text-steel" />

                    <h1 className="text-xl font-black tracking-tight text-ink">
                        Category not found
                    </h1>

                    <p className="mt-2 text-sm text-steel">
                        This category may have been removed or is no longer
                        available.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full bg-bg">
            {/* =========================================================
                CATEGORY HERO
            ========================================================= */}
            <section className="bg-ink px-4 py-9 text-paper sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                        Category
                    </div>

                    {categoriesLoading ? (
                        <div className="mt-3 h-8 w-64 max-w-full animate-pulse bg-paper/10" />
                    ) : (
                        <>
                            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                {category?.name}
                            </h1>

                            {category?.description && (
                                <p className="mt-2 max-w-xl text-sm text-steel-light">
                                    {category.description}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </section>

            <div className="px-4 py-10 sm:px-6 sm:py-14">
                <div className="mx-auto max-w-[1240px]">
                    {/* Breadcrumb */}
                    <div className="mb-5 flex items-center gap-2 text-[12px] font-semibold text-steel">
                        <Link
                            href="/"
                            className="transition-colors hover:text-accent-dark"
                        >
                            Home
                        </Link>
                        <span className="opacity-50">/</span>
                        <span className="text-ink">
                            {category?.name ?? "Category"}
                        </span>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[13px] font-semibold text-steel">
                            {loading
                                ? "Loading products..."
                                : `${categoryProducts.length} product${
                                      categoryProducts.length === 1
                                          ? ""
                                          : "s"
                                  }`}
                        </span>

                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value as SortOption)
                            }
                            className="border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink outline-none transition-colors focus:border-accent"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="border border-ink/10 bg-paper">
                                    <div className="aspect-square animate-pulse bg-ink/5" />
                                    <div className="space-y-2 p-3.5">
                                        <div className="h-4 w-4/5 animate-pulse bg-ink/5" />
                                        <div className="h-3 w-2/5 animate-pulse bg-ink/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && categoryProducts.length === 0 && (
                        <div className="flex flex-col items-center gap-3 border border-ink/10 bg-paper px-6 py-16 text-center">
                            <FaBoxOpen size={24} className="text-steel" />

                            <p className="max-w-xs text-sm text-steel">
                                No products in this category yet. Check back
                                soon, or ask us directly.
                            </p>

                            <a
                                href={waLink(
                                    `Hello Fuzio Gorilla, do you have any ${
                                        category?.name ?? ""
                                    } products in stock?`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-2 bg-green px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
                            >
                                <FaWhatsapp />
                                Ask on WhatsApp
                            </a>
                        </div>
                    )}

                    {/* Product grid — bordered card: image block with
                        stock/featured tags, then a separate info panel
                        with name, description, price and a "View
                        Product" link. */}
                    {!loading && categoryProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {categoryProducts.map((product) => {
                                const price = lowestPriceFor(product.id);

                                const inStock = variantsLoading
                                    ? false
                                    : variants.some(
                                          (v) =>
                                              v.product === product.id &&
                                              v.is_active &&
                                              v.quantity > 0
                                      );

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        className="group flex flex-col border border-ink/10 bg-paper transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(21,20,15,0.10)]"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-ink-2">
                                            {inStock && (
                                                <span className="absolute left-2 top-2 z-10 bg-paper px-1.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] text-green">
                                                    In Stock
                                                </span>
                                            )}

                                            {product.feature && (
                                                <span className="absolute right-2 top-2 z-10 bg-accent px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wide text-ink">
                                                    Featured
                                                </span>
                                            )}

                                            {product.image ? (
                                                <Image
                                                    src={
                                                        mediaUrl(
                                                            product.image
                                                        )!
                                                    }
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-steel">
                                                    <FaBoxOpen size={22} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-3.5">
                                            <h3 className="text-[13.5px] font-bold leading-snug text-ink line-clamp-2">
                                                {product.name}
                                            </h3>

                                            {product.description && (
                                                <p className="mt-1 text-[11.5px] leading-relaxed text-steel line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}

                                            <p className="mt-auto pt-2.5 font-mono text-[14.5px] font-bold text-ink">
                                                {price !== null
                                                    ? formatPrice(price)
                                                    : "Enquire for pricing"}
                                            </p>

                                            <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.06em] text-accent-dark group-hover:text-ink">
                                                View Product
                                                <FaArrowRight
                                                    size={9}
                                                    className="transition-transform group-hover:translate-x-1"
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}