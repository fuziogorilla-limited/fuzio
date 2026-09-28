"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaMobileAlt,
    FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { usePlaceOrder } from "@/hooks/useOrders";
import { usePayment } from "@/hooks/usePayment";
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

function buildWhatsappSupportMessage(order: OrderPayload): string {
    return (
        `Hello Fuzio Gorilla,\n\nI'm having trouble completing payment for my order.\n\n` +
        `Order Number:\n${order.order_number}\n\n` +
        `Could you please help me sort out my payment?`
    );
}

export default function Checkout() {
    const { items, subtotal, deliveryFee, total, clearCart } = useCart();

    const {
        placeOrder,
        submitting: placingOrder,
        error: orderError,
    } = usePlaceOrder();

    const {
        pay,
        status: paymentStatus,
        error: paymentError,
        submitting: paying,
    } = usePayment();

    const [form, setForm] = useState<FormState>(emptyForm);
    const [pendingOrder, setPendingOrder] = useState<OrderPayload | null>(
        null
    );
    const [paidOrder, setPaidOrder] = useState<OrderPayload | null>(null);
    const [mpesaPhone, setMpesaPhone] = useState("");

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

            setPendingOrder(order);
            setMpesaPhone(form.phone);
            clearCart();
        } catch {
            // `orderError` from the hook already carries a readable message —
            // nothing else to do here, the banner below will show it.
        }
    };

    const handlePay = async (e: FormEvent) => {
        e.preventDefault();

        if (!pendingOrder) return;

        const result = await pay(
            pendingOrder.order_number,
            pendingOrder.public_token,
            mpesaPhone
        );

        if (result) {
            setPaidOrder(result);
        }
    };

    /* ------------------------------------------------------------------ */
    /*  Payment confirmed — success view                                   */
    /* ------------------------------------------------------------------ */

    if (paidOrder) {
        return (
            <div className="px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green text-white">
                        <FaCheckCircle size={30} />
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                        Payment Received
                    </h1>

                    <p className="mt-2 text-sm text-steel">
                        Thank you for choosing Fuzio Gorilla. Your order is
                        confirmed and on its way.
                    </p>

                    <p className="mt-1 text-sm text-steel">
                        Your order number is:
                    </p>

                    <div className="mt-3 mb-8 font-mono text-xl font-bold tracking-wide text-accent-dark">
                        {paidOrder.order_number}
                    </div>

                    <Link
                        href="/"
                        className="mx-auto flex w-full max-w-xs items-center justify-center border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------------ */
    /*  Order placed, payment pending — pay with M-Pesa                    */
    /* ------------------------------------------------------------------ */

    if (pendingOrder) {
        const isWaiting = paymentStatus === "awaiting_pin";
        const canRetry =
            paymentStatus === "timeout" || paymentStatus === "failed";

        return (
            <div className="px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink">
                        <FaMobileAlt size={26} />
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                        Complete Your Payment
                    </h1>

                    <p className="mt-2 text-sm text-steel">
                        Order{" "}
                        <span className="font-mono font-bold text-ink">
                            {pendingOrder.order_number}
                        </span>{" "}
                        — pay{" "}
                        <span className="font-bold text-ink">
                            {formatPrice(pendingOrder.total_amount)}
                        </span>{" "}
                        via M-Pesa to confirm it.
                    </p>

                    {paymentError && (
                        <div className="mt-5 border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-left text-[13px] font-semibold text-red-700">
                            {paymentError}
                        </div>
                    )}

                    {isWaiting ? (
                        <div className="mt-6">
                            <p className="text-sm font-semibold text-ink">
                                Check your phone
                            </p>
                            <p className="mt-1 text-[13px] text-steel">
                                Enter your M-Pesa PIN on the prompt sent to{" "}
                                <span className="font-semibold text-ink">
                                    {mpesaPhone}
                                </span>{" "}
                                to finish paying.
                            </p>
                            <div
                                className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-ink/10"
                                role="status"
                                aria-label="Waiting for payment confirmation"
                            >
                                <div className="h-full w-1/2 animate-pulse bg-accent" />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handlePay} className="mt-6 text-left">
                            <label className={labelClass}>
                                M-Pesa Phone Number
                            </label>
                            <input
                                required
                                type="tel"
                                className={inputClass}
                                placeholder="07XX XXX XXX"
                                value={mpesaPhone}
                                onChange={(e) =>
                                    setMpesaPhone(e.target.value)
                                }
                            />

                            <button
                                type="submit"
                                disabled={paying}
                                className="mt-4 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {paying
                                    ? "Sending Prompt..."
                                    : canRetry
                                        ? "Retry Payment"
                                        : "Pay With M-Pesa"}
                            </button>

                            {paymentStatus === "timeout" && (
                                <p className="mt-3 text-center text-[11.5px] text-steel">
                                    Didn&apos;t get a prompt, or already paid?
                                    Try again above, or{" "}
                                    <a
                                        href={waLink(
                                            buildWhatsappSupportMessage(
                                                pendingOrder
                                            )
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-accent-dark underline"
                                    >
                                        <FaWhatsapp /> message us
                                    </a>
                                    .
                                </p>
                            )}
                        </form>
                    )}
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
                        {orderError && (
                            <div className="mb-5 border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">
                                {orderError}
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
                            disabled={placingOrder}
                            className="mt-5 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {placingOrder
                                ? "Placing Order..."
                                : "Place Order"}
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