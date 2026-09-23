"use client";

import Image from "next/image";
import Link from "next/link";
import { FaTimes, FaWhatsapp, FaShoppingBag } from "react-icons/fa";

import { useCart, type CartItem } from "@/context/CartContext";
import { formatPrice, mediaUrl, waLink } from "@/lib/utils";

function buildWhatsappMessage(items: CartItem[], total: number): string {
    let msg =
        "Hello Fuzio Gorilla,\n\nI would like to place an order.\n\nProducts:\n";

    items.forEach((item) => {
        const opts = [item.colorName, item.sizeName]
            .filter(Boolean)
            .join(", ");

        msg += `- ${item.productName}${
            opts ? ` (${opts})` : ""
        } x${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`;
    });

    msg += `\nTotal:\n${formatPrice(
        total
    )}\n\nPlease confirm my order and delivery details.`;

    return msg;
}

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        subtotal,
        deliveryFee,
        total,
        incrementQuantity,
        decrementQuantity,
        removeItem,
    } = useCart();

    return (
        <>
            {/* Overlay */}
            <div
                onClick={closeCart}
                aria-hidden="true"
                className={`fixed inset-0 z-[90] bg-ink/60 transition-opacity duration-200 ${
                    isOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            />

            {/* Drawer */}
            <aside
                aria-label="Shopping cart"
                className={`fixed right-0 top-0 z-[95] flex h-full w-full max-w-[420px] flex-col bg-paper shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-ink/10 px-5 py-4">
                    <h3 className="text-base font-black uppercase tracking-tight text-ink">
                        Your Cart
                    </h3>

                    <button
                        type="button"
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="text-steel transition-colors hover:text-ink"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center text-steel">
                            <FaShoppingBag size={26} />
                            <p className="text-[13.5px] leading-relaxed">
                                Your cart is empty.
                                <br />
                                Browse products to get started.
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col divide-y divide-ink/10">
                            {items.map((item) => (
                                <li
                                    key={item.variantId}
                                    className="flex gap-3 py-4 first:pt-0"
                                >
                                    <div className="relative h-[58px] w-[58px] flex-shrink-0 overflow-hidden bg-ink/5">
                                        {item.image ? (
                                            <Image
                                                src={mediaUrl(item.image)!}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-steel">
                                                <FaShoppingBag size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate text-[13px] font-bold text-ink">
                                            {item.productName}
                                        </h4>

                                        <p className="mt-0.5 text-[11px] text-steel">
                                            {[item.colorName, item.sizeName]
                                                .filter(Boolean)
                                                .join(" · ") || "Standard"}
                                        </p>

                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <div className="flex items-center border border-ink/15">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decrementQuantity(
                                                            item.variantId
                                                        )
                                                    }
                                                    aria-label="Decrease quantity"
                                                    className="flex h-6 w-6 items-center justify-center text-sm font-bold text-ink transition-colors hover:bg-ink/5"
                                                >
                                                    −
                                                </button>

                                                <span className="w-6 text-center font-mono text-[12px] font-bold text-ink">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        incrementQuantity(
                                                            item.variantId
                                                        )
                                                    }
                                                    aria-label="Increase quantity"
                                                    className="flex h-6 w-6 items-center justify-center text-sm font-bold text-ink transition-colors hover:bg-ink/5"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <span className="font-mono text-[13px] font-bold text-ink">
                                                {formatPrice(
                                                    item.price * item.quantity
                                                )}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(item.variantId)
                                            }
                                            className="mt-2 text-[11px] font-semibold text-steel underline transition-colors hover:text-accent-dark"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="flex-shrink-0 border-t border-ink/10 px-5 py-5">
                        <div className="mb-1.5 flex justify-between text-[13px] text-steel">
                            <span>Subtotal</span>
                            <span className="font-mono">
                                {formatPrice(subtotal)}
                            </span>
                        </div>

                        <div className="mb-3 flex justify-between text-[13px] text-steel">
                            <span>Delivery</span>
                            <span className="font-mono">
                                {formatPrice(deliveryFee)}
                            </span>
                        </div>

                        <div className="mb-4 flex justify-between border-t border-ink/10 pt-3 text-[15px] font-black text-ink">
                            <span>Total</span>
                            <span className="font-mono">
                                {formatPrice(total)}
                            </span>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="block w-full bg-ink px-5 py-3 text-center text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink"
                        >
                            Proceed to Checkout
                        </Link>

                        <a
                            href={waLink(
                                buildWhatsappMessage(items, total)
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2.5 flex w-full items-center justify-center gap-2 bg-green px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
                        >
                            <FaWhatsapp />
                            Order on WhatsApp
                        </a>

                        <p className="mt-3 text-center text-[11px] text-steel">
                            Guest checkout — no account needed.
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}