"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaBoxOpen, FaSearch, FaWhatsapp } from "react-icons/fa";

import {
    usePublicCategories,
    usePublicProducts,
    usePublicProductVariants,
} from "@/hooks/useInventory";
import { formatPrice, mediaUrl, waLink } from "@/lib/utils";

type SortOption = "featured" | "price-low" | "price-high" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Sort: Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
];

const ALL_CATEGORIES = "all";

export default function AllProducts() {
    const { categories, loading: categoriesLoading } = usePublicCategories();
    const { products, loading: productsLoading } = usePublicProducts();
    const {
        variants,
        loading: variantsLoading,
        lowestPriceFor,
    } = usePublicProductVariants();

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
    const [sort, setSort] = useState<SortOption>("featured");

    const loading = categoriesLoading || productsLoading;

    const visibleProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        let list = products.filter((p) => {
            const matchesCategory =
                activeCategory === ALL_CATEGORIES ||
                String(p.category) === activeCategory;

            if (!matchesCategory) return false;
            if (!term) return true;

            return (
                p.name.toLowerCase().includes(term) ||
                (p.description ?? "").toLowerCase().includes(term)
            );
        });

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
        } else if (sort === "name") {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // Featured items first; the API already orders the rest by
            // -date_added so newest-within-group stays stable.
            list = [...list].sort(
                (a, b) => Number(b.feature) - Number(a.feature)
            );
        }

        return list;
    }, [products, activeCategory, search, sort, lowestPriceFor]);

    return (
        <main className="w-full bg-bg">
            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="bg-ink px-4 py-9 text-paper sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                        Catalogue
                    </div>

                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        All Products
                    </h1>

                    <p className="mt-2 max-w-xl text-sm text-steel-light">
                        Workwear, PPE, cleaning supplies, waste management and
                        industrial essentials — everything in one catalogue.
                    </p>
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
                        <span className="text-ink">Products</span>
                    </div>

                    {/* Search */}
                    <div className="mb-5 flex items-center gap-2 border border-ink/15 bg-paper px-3.5 py-2.5">
                        <FaSearch size={13} className="shrink-0 text-steel" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-steel"
                        />
                    </div>

                    {/* Category filter pills */}
                    {!categoriesLoading && categories.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveCategory(ALL_CATEGORIES)}
                                className={`border px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                                    activeCategory === ALL_CATEGORIES
                                        ? "border-ink bg-ink text-paper"
                                        : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                                }`}
                            >
                                All
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(String(category.id))
                                    }
                                    className={`border px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                                        activeCategory === String(category.id)
                                            ? "border-ink bg-ink text-paper"
                                            : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[13px] font-semibold text-steel">
                            {loading
                                ? "Loading products..."
                                : `${visibleProducts.length} product${
                                      visibleProducts.length === 1 ? "" : "s"
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
                                <div
                                    key={i}
                                    className="border border-ink/10 bg-paper"
                                >
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
                    {!loading && visibleProducts.length === 0 && (
                        <div className="flex flex-col items-center gap-3 border border-ink/10 bg-paper px-6 py-16 text-center">
                            <FaBoxOpen size={24} className="text-steel" />

                            <p className="max-w-xs text-sm text-steel">
                                {search
                                    ? `No products found for "${search}". Try another search term.`
                                    : "No products found. Check back soon, or ask us directly."}
                            </p>

                            <a
                                href={waLink(
                                    "Hello Fuzio Gorilla, do you have specific products in stock?"
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
                    {!loading && visibleProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {visibleProducts.map((product) => {
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