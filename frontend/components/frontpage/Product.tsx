"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    FaBoxOpen,
    FaWhatsapp,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";

import {
    usePublicCategories,
    usePublicProducts,
    usePublicProductVariants,
} from "@/hooks/useInventory";
import { useCart } from "@/context/CartContext";
import { formatPrice, mediaUrl, waLink } from "@/lib/utils";

// Below this, we start naming the number rather than just saying "In Stock".
const LOW_STOCK_THRESHOLD = 5;

/** Ordered de-dupe — keeps first-seen order instead of alphabetising. */
function uniqueInOrder(values: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    values.forEach((v) => {
        if (v && !seen.has(v)) {
            seen.add(v);
            result.push(v);
        }
    });

    return result;
}

export default function Product({ productId }: { productId: string }) {
    const id = Number(productId);
    const router = useRouter();
    const { addItem } = useCart();

    const { categories, loading: categoriesLoading } = usePublicCategories();
    const { products, loading: productsLoading } = usePublicProducts();
    const {
        variants,
        loading: variantsLoading,
        lowestPriceFor,
    } = usePublicProductVariants();

    const product = products.find((p) => p.id === id);
    const category = product
        ? categories.find((c) => c.id === product.category)
        : undefined;

    const productVariants = useMemo(
        () => variants.filter((v) => v.product === id),
        [variants, id]
    );

    // Only variants that are actually sellable right now — these decide
    // which size/colour buttons are even offered.
    const activeVariants = useMemo(
        () => productVariants.filter((v) => v.is_active && v.quantity > 0),
        [productVariants]
    );

    const availableSizes = useMemo(
        () => uniqueInOrder(activeVariants.map((v) => v.size)),
        [activeVariants]
    );
    const availableColors = useMemo(
        () => uniqueInOrder(activeVariants.map((v) => v.color)),
        [activeVariants]
    );

    // The full set of sizes/colours this product comes in at all, stocked
    // or not — used only to work out whether a given axis is meaningful
    // when looking up the exact combination someone has selected.
    const allSizes = useMemo(
        () => uniqueInOrder(productVariants.map((v) => v.size)),
        [productVariants]
    );
    const allColors = useMemo(
        () => uniqueInOrder(productVariants.map((v) => v.color)),
        [productVariants]
    );

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [qty, setQty] = useState(1);

    // Seed the selection once we know what's actually available.
    useEffect(() => {
        if (availableSizes.length && !selectedSize) {
            setSelectedSize(availableSizes[0]);
        }
        if (availableColors.length && !selectedColor) {
            setSelectedColor(availableColors[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableSizes, availableColors]);

    // The exact row for whatever's selected, regardless of stock — this is
    // what lets us say "Size M is 0 left" instead of a blanket message.
    const selectedVariant = useMemo(
        () =>
            productVariants.find(
                (v) =>
                    (!allSizes.length || v.size === selectedSize) &&
                    (!allColors.length || v.color === selectedColor)
            ) ?? null,
        [productVariants, selectedSize, selectedColor, allSizes, allColors]
    );

    const inStock = Boolean(
        selectedVariant?.is_active && selectedVariant.quantity > 0
    );

    // Everything below (cart, buy now, price, specs) should only ever see a
    // variant when it's genuinely purchasable.
    const matchedVariant = inStock ? selectedVariant : null;

    // Keep the quantity stepper inside whatever's actually in stock.
    useEffect(() => {
        if (matchedVariant) {
            setQty((q) => Math.min(Math.max(q, 1), matchedVariant.quantity));
        } else {
            setQty(1);
        }
    }, [matchedVariant]);

    const loading = productsLoading || variantsLoading || categoriesLoading;

    if (!productsLoading && !product) {
        return (
            <div className="px-4 py-20 text-center sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <FaBoxOpen
                        size={28}
                        className="mx-auto mb-4 text-steel"
                    />

                    <h1 className="text-xl font-black tracking-tight text-ink">
                        Product not found
                    </h1>

                    <p className="mt-2 text-sm text-steel">
                        This product may have been removed or is no longer
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

    if (loading || !product) {
        return (
            <div className="px-4 py-10 sm:px-6 sm:py-14">
                <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-2 md:gap-12">
                    <div className="aspect-square animate-pulse bg-ink/5" />
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 animate-pulse bg-ink/5" />
                        <div className="h-6 w-1/3 animate-pulse bg-ink/5" />
                        <div className="h-24 w-full animate-pulse bg-ink/5" />
                    </div>
                </div>
            </div>
        );
    }

    const displayPrice = matchedVariant
        ? Number(matchedVariant.selling_price)
        : lowestPriceFor(product.id);

    // Builds the label for whatever combination is currently selected:
    // "Only 3 left", "Size M — 0 left", "Size M · Red — 0 left", etc.
    const stockStatus = (() => {
        const selectionParts = [
            selectedSize && allSizes.length ? `Size ${selectedSize}` : null,
            selectedColor && allColors.length
                ? `Colour ${selectedColor}`
                : null,
        ].filter(Boolean);

        const selectionLabel = selectionParts.join(" · ");

        if (matchedVariant) {
            if (matchedVariant.quantity <= LOW_STOCK_THRESHOLD) {
                return {
                    positive: true,
                    text: selectionLabel
                        ? `${selectionLabel} — only ${matchedVariant.quantity} left`
                        : `Only ${matchedVariant.quantity} left`,
                };
            }

            return {
                positive: true,
                text: selectionLabel
                    ? `${selectionLabel} — in stock`
                    : "In Stock",
            };
        }

        const remaining = selectedVariant?.quantity ?? 0;

        return {
            positive: false,
            text: selectionLabel
                ? `${selectionLabel} — ${remaining} left`
                : `Out of stock — ${remaining} left`,
        };
    })();

    const changeQty = (delta: number) => {
        setQty((q) => {
            const max = matchedVariant?.quantity ?? 1;
            return Math.min(Math.max(q + delta, 1), max);
        });
    };

    const handleAddToCart = () => {
        if (!matchedVariant) return;

        addItem({
            variantId: matchedVariant.id,
            productId: product.id,
            productName: product.name,
            image: product.image,
            price: Number(matchedVariant.selling_price),
            colorName: matchedVariant.color,
            sizeName: matchedVariant.size,
            sku: matchedVariant.sku,
            quantity: qty,
        });
    };

    const handleBuyNow = () => {
        if (!matchedVariant) return;

        handleAddToCart();
        router.push("/checkout");
    };

    const handleWhatsappOrder = () => {
        if (!matchedVariant) return;

        const opts = [matchedVariant.color, matchedVariant.size]
            .filter(Boolean)
            .join(", ");

        const msg =
            `Hello Fuzio Gorilla,\n\nI would like to place an order.\n\n` +
            `Product:\n${product.name}${opts ? ` (${opts})` : ""}\n\n` +
            `Quantity:\n${qty}\n\n` +
            `Total:\n${formatPrice(
                Number(matchedVariant.selling_price) * qty
            )}\n\n` +
            `Please confirm my order and delivery details.`;

        window.open(waLink(msg), "_blank");
    };

    // Built from what the schema actually has — no invented spec fields.
    const specs: { label: string; value: string }[] = [
        { label: "Category", value: category?.name ?? "—" },
        ...(matchedVariant
            ? [{ label: "SKU", value: matchedVariant.sku }]
            : []),
        ...(availableColors.length
            ? [
                  {
                      label: "Available Colours",
                      value: availableColors.join(", "),
                  },
              ]
            : []),
        ...(availableSizes.length
            ? [
                  {
                      label: "Available Sizes",
                      value: availableSizes.join(", "),
                  },
              ]
            : []),
    ];

    return (
        <div className="px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-[1240px]">
                {/* Breadcrumb */}
                <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-steel">
                    <Link
                        href="/"
                        className="transition-colors hover:text-accent-dark"
                    >
                        Home
                    </Link>
                    <span className="opacity-50">/</span>
                    {category ? (
                        <Link
                            href={`/category/${category.id}`}
                            className="transition-colors hover:text-accent-dark"
                        >
                            {category.name}
                        </Link>
                    ) : (
                        <span>Category</span>
                    )}
                    <span className="opacity-50">/</span>
                    <span className="text-ink">{product.name}</span>
                </div>

                <div className="grid gap-10 md:grid-cols-2 md:gap-12">
                    {/* Gallery */}
                    <div className="relative aspect-square overflow-hidden bg-ink-2">
                        {product.image ? (
                            <Image
                                src={mediaUrl(product.image)!}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-steel-light">
                                <FaBoxOpen size={48} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h1 className="text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl">
                            {product.name}
                        </h1>

                        <div className="mt-3 font-mono text-xl font-bold text-ink sm:text-2xl">
                            {displayPrice !== null
                                ? formatPrice(displayPrice)
                                : "Enquire for pricing"}
                        </div>

                        <div
                            className={`mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${
                                stockStatus.positive
                                    ? "text-green"
                                    : "text-red-600"
                            }`}
                        >
                            {stockStatus.positive ? (
                                <FaCheckCircle size={11} />
                            ) : (
                                <FaTimesCircle size={11} />
                            )}
                            {stockStatus.text}
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-steel">
                            {product.description}
                        </p>

                        {/* Size */}
                        {availableSizes.length > 0 && (
                            <div className="mt-6">
                                <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                                    Size
                                </span>

                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }
                                            className={`border-2 px-4 py-2 text-[13px] font-semibold transition-colors ${
                                                selectedSize === size
                                                    ? "border-ink bg-ink text-paper"
                                                    : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colour */}
                        {availableColors.length > 0 && (
                            <div className="mt-5">
                                <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                                    Colour
                                </span>

                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                setSelectedColor(color)
                                            }
                                            className={`border-2 px-4 py-2 text-[13px] font-semibold transition-colors ${
                                                selectedColor === color
                                                    ? "border-ink bg-ink text-paper"
                                                    : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mt-5">
                            <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                                Quantity
                            </span>

                            <div className="flex w-fit items-center border-2 border-ink/15">
                                <button
                                    type="button"
                                    onClick={() => changeQty(-1)}
                                    disabled={!inStock}
                                    className="flex h-10 w-10 items-center justify-center text-base font-bold text-ink transition-colors hover:bg-ink/5 disabled:opacity-40"
                                >
                                    −
                                </button>

                                <span className="w-11 text-center font-mono text-sm font-bold text-ink">
                                    {qty}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => changeQty(1)}
                                    disabled={!inStock}
                                    className="flex h-10 w-10 items-center justify-center text-base font-bold text-ink transition-colors hover:bg-ink/5 disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-7 flex max-w-sm flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={!inStock}
                                className="w-full bg-accent px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Buy Now
                            </button>

                            <button
                                type="button"
                                onClick={handleWhatsappOrder}
                                disabled={!inStock}
                                className="flex w-full items-center justify-center gap-2 bg-green px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FaWhatsapp />
                                Order on WhatsApp
                            </button>
                        </div>

                        {/* Specifications */}
                        {specs.length > 0 && (
                            <div className="mt-8 border-t border-ink/10 pt-6">
                                <h2 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                                    Specifications
                                </h2>

                                <table className="w-full border-collapse text-[13px]">
                                    <tbody>
                                        {specs.map((row) => (
                                            <tr
                                                key={row.label}
                                                className="border-b border-ink/10"
                                            >
                                                <td className="w-2/5 py-2 text-steel">
                                                    {row.label}
                                                </td>
                                                <td className="py-2 font-semibold text-ink">
                                                    {row.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}