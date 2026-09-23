"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { usePlaceOrder } from "@/hooks/useOrders";
import { formatPrice, mediaUrl, waLink } from "@/lib/utils";
import type { OrderContactInput, OrderPayload } from "@/types/orders";

const inputClass =
    "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent";

const labelClass =
    "mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-steel";

type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    county: string;
    town: string;
    address: string;
    notes: string;
};

const emptyForm: FormState = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    county: "",
    town: "",
    address: "",
    notes: "",
};

function buildWhatsappConfirmMessage(order: OrderPayload): string {
    let msg =
        `Hello Fuzio Gorilla,\n\nI would like to place an order.\n\n` +
        `Order Number:\n${order.order_number}\n\nProducts:\n`;

    order.items.forEach((item) => {
        const opts = [item.color, item.size].filter(Boolean).join(", ");
        msg += `- ${item.product_name}${
            opts ? ` (${opts})` : ""
        } x${item.quantity}\n`;
    });

    msg +=
        `\nTotal:\n${formatPrice(order.total_amount)}\n\n` +
        `Delivery Location:\n${order.address}, ${order.town}, ${order.county}\n\n` +
        `Name: ${order.first_name} ${order.last_name}\n` +
        `Phone: ${order.phone_number}\n\n` +
        `Please confirm my order and delivery details.`;

    return msg;
}

export default function Checkout() {
    const { items, subtotal, deliveryFee, total, clearCart } = useCart();
    const { placeOrder, submitting, error } = usePlaceOrder();

    const [form, setForm] = useState<FormState>(emptyForm);
    const [completedOrder, setCompletedOrder] = useState<OrderPayload | null>(
        null
    );

    const update = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const contact: OrderContactInput = {
            first_name: form.firstName,
            last_name: form.lastName,
            phone_number: form.phone,
            email: form.email || undefined,
            county: form.county,
            town: form.town,
            address: form.address,
            additional_information: form.notes || undefined,
        };

        try {
            const order = await placeOrder(
                items.map((i) => ({
                    variantId: i.variantId,
                    quantity: i.quantity,
                })),
                contact
            );

            setCompletedOrder(order);
            clearCart();
        } catch {
            // `error` from the hook already carries a readable message —
            // nothing else to do here, the banner below will show it.
        }
    };

    /* ------------------------------------------------------------------ */
    /*  Order placed — confirmation view                                   */
    /* ------------------------------------------------------------------ */

    if (completedOrder) {
        return (
            <div className="px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green text-white">
                        <FaCheckCircle size={30} />
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                        Order Received
                    </h1>

                    <p className="mt-2 text-sm text-steel">
                        Thank you for choosing Fuzio Gorilla.
                    </p>

                    <p className="mt-1 text-sm text-steel">
                        Your order number is:
                    </p>

                    <div className="mt-3 mb-8 font-mono text-xl font-bold tracking-wide text-accent-dark">
                        {completedOrder.order_number}
                    </div>

                    <div className="mx-auto flex max-w-xs flex-col gap-2.5">
                        <a
                            href={waLink(
                                buildWhatsappConfirmMessage(completedOrder)
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 bg-green px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
                        >
                            <FaWhatsapp />
                            Confirm on WhatsApp
                        </a>

                        <Link
                            href="/"
                            className="w-full border-2 border-ink px-6 py-3 text-center text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    <p className="mt-6 text-[11.5px] text-steel">
                        Online payment is coming soon — for now, we&apos;ll
                        confirm your order and delivery details over
                        WhatsApp.
                    </p>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------------ */
    /*  Empty cart guard                                                   */
    /* ------------------------------------------------------------------ */

    if (items.length === 0) {
        return (
            <div className="px-4 py-20 text-center sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <FaBoxOpen size={28} className="mx-auto mb-4 text-steel" />

                    <h1 className="text-xl font-black tracking-tight text-ink">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-sm text-steel">
                        Add something to your cart before checking out.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-accent-dark"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------------ */
    /*  Checkout form                                                       */
    /* ------------------------------------------------------------------ */

    return (
        <div className="px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-[1240px]">
                <div className="mb-8">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                        Checkout
                    </div>
                    <h1 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
                        Delivery &amp; Contact Details
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12"
                >
                    {/* Form fields */}
                    <div>
                        {error && (
                            <div className="mb-5 border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    First Name
                                </label>
                                <input
                                    required
                                    className={inputClass}
                                    placeholder="Jane"
                                    value={form.firstName}
                                    onChange={update("firstName")}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Last Name
                                </label>
                                <input
                                    required
                                    className={inputClass}
                                    placeholder="Wanjiru"
                                    value={form.lastName}
                                    onChange={update("lastName")}
                                />
                            </div>
                        </div>

                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Phone Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    className={inputClass}
                                    placeholder="07XX XXX XXX"
                                    value={form.phone}
                                    onChange={update("phone")}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Email Address{" "}
                                    <span className="normal-case text-steel-light">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    placeholder="jane@example.com"
                                    value={form.email}
                                    onChange={update("email")}
                                />
                            </div>
                        </div>

                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>County</label>
                                <input
                                    required
                                    className={inputClass}
                                    placeholder="Nairobi"
                                    value={form.county}
                                    onChange={update("county")}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Town / City
                                </label>
                                <input
                                    required
                                    className={inputClass}
                                    placeholder="Industrial Area"
                                    value={form.town}
                                    onChange={update("town")}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Delivery Address
                            </label>
                            <input
                                required
                                className={inputClass}
                                placeholder="Street, building, landmark"
                                value={form.address}
                                onChange={update("address")}
                            />
                        </div>

                        <div className="mb-2">
                            <label className={labelClass}>
                                Additional Order Notes{" "}
                                <span className="normal-case text-steel-light">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                rows={3}
                                className={inputClass}
                                placeholder="Any special instructions"
                                value={form.notes}
                                onChange={update("notes")}
                            />
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="h-fit border border-ink/10 bg-paper p-6">
                        <h3 className="mb-4 text-[15px] font-black text-ink">
                            Order Summary
                        </h3>

                        <ul className="divide-y divide-ink/10">
                            {items.map((item) => {
                                const opts = [
                                    item.colorName,
                                    item.sizeName,
                                ]
                                    .filter(Boolean)
                                    .join(" · ");

                                return (
                                    <li
                                        key={item.variantId}
                                        className="flex items-center gap-3 py-3 first:pt-0"
                                    >
                                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden bg-ink/5">
                                            {item.image ? (
                                                <Image
                                                    src={
                                                        mediaUrl(item.image)!
                                                    }
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-steel">
                                                    <FaBoxOpen size={14} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[12.5px] font-semibold text-ink">
                                                {item.productName} ×{" "}
                                                {item.quantity}
                                            </p>
                                            {opts && (
                                                <p className="text-[11px] text-steel">
                                                    {opts}
                                                </p>
                                            )}
                                        </div>

                                        <span className="flex-shrink-0 font-mono text-[12.5px] font-semibold text-ink">
                                            {formatPrice(
                                                item.price * item.quantity
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-4 flex justify-between text-[13px] text-steel">
                            <span>Subtotal</span>
                            <span className="font-mono">
                                {formatPrice(subtotal)}
                            </span>
                        </div>

                        <div className="mt-1.5 flex justify-between text-[13px] text-steel">
                            <span>Delivery</span>
                            <span className="font-mono">
                                {formatPrice(deliveryFee)}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-[16px] font-black text-ink">
                            <span>Total</span>
                            <span className="font-mono">
                                {formatPrice(total)}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-5 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Placing Order..." : "Place Order"}
                        </button>

                        <p className="mt-3 text-center text-[11px] text-steel">
                            Guest checkout — no account needed.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}