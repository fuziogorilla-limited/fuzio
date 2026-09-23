"use client";

import { useEffect, useMemo, useState } from "react";
import {
    FaChevronDown,
    FaChevronRight,
    FaClipboardList,
    FaWhatsapp,
} from "react-icons/fa";

import { useAdminOrders, useOrderLookup } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import {
    ORDER_STATUS_LABELS,
    type AdminOrderListItem,
    type OrderPayload,
    type OrderStatus,
} from "@/types/orders";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [
    OrderStatus,
    string
][];

const STATUS_STYLES: Record<OrderStatus, string> = {
    pending_payment: "bg-ink/10 text-ink",
    paid: "bg-green/10 text-green",
    processing: "bg-accent/15 text-accent-dark",
    shipped: "bg-accent/15 text-accent-dark",
    delivered: "bg-green/10 text-green",
    cancelled: "bg-red-500/10 text-red-600",
    payment_failed: "bg-red-500/10 text-red-600",
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("en-KE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** Best-effort normalisation of a Kenyan number for a wa.me link (07... -> 2547...). */
function toWhatsappNumber(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) return `254${digits.slice(1)}`;
    return digits;
}

function customerWaLink(phone: string, message: string): string {
    return `https://wa.me/${toWhatsappNumber(phone)}?text=${encodeURIComponent(
        message
    )}`;
}

function buildCustomerMessage(order: OrderPayload): string {
    let msg = `Hello ${order.first_name},\n\nThis is Fuzio Gorilla regarding your order ${order.order_number}.\n\n`;

    msg += "Items:\n";
    order.items.forEach((item) => {
        const opts = [item.color, item.size].filter(Boolean).join(", ");
        msg += `- ${item.product_name}${
            opts ? ` (${opts})` : ""
        } x${item.quantity}\n`;
    });

    msg += `\nTotal: ${formatPrice(order.total_amount)}\n\n`;

    return msg;
}

function ErrorBanner({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="mb-4 border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-semibold text-red-700">
            {message}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Expandable order detail                                                  */
/* -------------------------------------------------------------------------- */

function OrderDetailPanel({ order }: { order: AdminOrderListItem }) {
    const { order: detail, loading, error, fetchOrder } = useOrderLookup();

    useEffect(() => {
        // The public_token comes back on the admin list row itself, so we
        // can reuse the guest order-lookup endpoint to pull full line items
        // on demand rather than needing a separate admin detail endpoint.
        fetchOrder(order.order_number, order.public_token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.order_number, order.public_token]);

    if (loading) {
        return (
            <p className="text-[13px] text-steel">
                Loading order details...
            </p>
        );
    }

    if (error) {
        return <ErrorBanner message={error} />;
    }

    if (!detail) return null;

    return (
        <div>
            <div className="mb-4 grid gap-6 sm:grid-cols-2">
                <div>
                    <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-steel">
                        Contact
                    </span>
                    <p className="text-[13px] font-semibold text-ink">
                        {detail.first_name} {detail.last_name}
                    </p>
                    <p className="text-[13px] text-steel">
                        {detail.phone_number}
                    </p>
                    {detail.email && (
                        <p className="text-[13px] text-steel">
                            {detail.email}
                        </p>
                    )}
                </div>

                <div>
                    <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-steel">
                        Delivery
                    </span>
                    <p className="text-[13px] text-steel">
                        {detail.address}, {detail.town}, {detail.county}
                    </p>
                    {detail.additional_information && (
                        <p className="mt-1 text-[12.5px] italic text-steel">
                            &ldquo;{detail.additional_information}&rdquo;
                        </p>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-[13px]">
                    <thead>
                        <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                            <th className="py-2 pr-3">Product</th>
                            <th className="py-2 pr-3">Options</th>
                            <th className="py-2 pr-3">Qty</th>
                            <th className="py-2 pr-3">Price</th>
                            <th className="py-2 pr-3 text-right">
                                Line Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {detail.items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-ink/5 last:border-b-0"
                            >
                                <td className="py-2.5 pr-3 font-semibold text-ink">
                                    {item.product_name}
                                </td>
                                <td className="py-2.5 pr-3 text-steel">
                                    {[item.color, item.size]
                                        .filter(Boolean)
                                        .join(" · ") || "—"}
                                </td>
                                <td className="py-2.5 pr-3 text-steel">
                                    {item.quantity}
                                </td>
                                <td className="py-2.5 pr-3 text-steel">
                                    {formatPrice(item.price)}
                                </td>
                                <td className="py-2.5 pr-3 text-right font-semibold text-ink">
                                    {formatPrice(item.total_price)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <a
                href={customerWaLink(
                    detail.phone_number,
                    buildCustomerMessage(detail)
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-green px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
            >
                <FaWhatsapp size={13} />
                Message Customer
            </a>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function AdminOrders() {
    const { orders, loading, error, updateOrderStatus } = useAdminOrders();

    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">(
        "all"
    );
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const visibleOrders = useMemo(() => {
        const filtered =
            statusFilter === "all"
                ? orders
                : orders.filter((o) => o.status === statusFilter);

        // Order model has no default ordering, so newest-first is enforced
        // here rather than relying on API order.
        return [...filtered].sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [orders, statusFilter]);

    const toggleExpand = (id: number) =>
        setExpandedId((prev) => (prev === id ? null : id));

    const handleStatusChange = async (
        order: AdminOrderListItem,
        status: OrderStatus
    ) => {
        setUpdatingId(order.id);
        setUpdateError(null);

        try {
            await updateOrderStatus(order.id, status);
        } catch {
            setUpdateError(
                `Failed to update status for ${order.order_number}.`
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-[1240px]">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                            Sales
                        </div>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-ink">
                            Orders
                        </h1>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as OrderStatus | "all"
                            )
                        }
                        className="border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink outline-none transition-colors focus:border-accent"
                    >
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <ErrorBanner message={error} />
                <ErrorBanner message={updateError} />

                {/* Orders list */}
                <div className="border border-ink/10 bg-paper">
                    {loading && (
                        <div className="p-6 text-sm text-steel">
                            Loading orders...
                        </div>
                    )}

                    {!loading && visibleOrders.length === 0 && (
                        <div className="flex flex-col items-center gap-2 p-10 text-center text-steel">
                            <FaClipboardList size={22} />
                            <p className="text-sm">
                                {statusFilter === "all"
                                    ? "No orders yet."
                                    : "No orders with this status."}
                            </p>
                        </div>
                    )}

                    {visibleOrders.map((order) => {
                        const isExpanded = expandedId === order.id;

                        return (
                            <div
                                key={order.id}
                                className="border-b border-ink/10 last:border-b-0"
                            >
                                {/* Order row */}
                                <div className="flex flex-wrap items-center gap-4 p-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(order.id)}
                                        className="text-steel transition-colors hover:text-ink"
                                        aria-label="Toggle order details"
                                    >
                                        {isExpanded ? (
                                            <FaChevronDown size={12} />
                                        ) : (
                                            <FaChevronRight size={12} />
                                        )}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-mono text-[13px] font-bold text-ink">
                                                {order.order_number}
                                            </h3>

                                            <span
                                                className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                                                    STATUS_STYLES[
                                                        order.status
                                                    ]
                                                }`}
                                            >
                                                {
                                                    ORDER_STATUS_LABELS[
                                                        order.status
                                                    ]
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-0.5 truncate text-[12px] text-steel">
                                            {order.first_name}{" "}
                                            {order.last_name} &middot;{" "}
                                            {order.phone_number} &middot;{" "}
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>

                                    <span className="flex-shrink-0 font-mono text-[14px] font-bold text-ink">
                                        {formatPrice(order.total_amount)}
                                    </span>

                                    <select
                                        value={order.status}
                                        disabled={updatingId === order.id}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order,
                                                e.target.value as OrderStatus
                                            )
                                        }
                                        className="flex-shrink-0 border border-ink/15 bg-paper px-2.5 py-1.5 text-[12px] font-semibold text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
                                    >
                                        {STATUS_OPTIONS.map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Detail panel */}
                                {isExpanded && (
                                    <div className="border-t border-ink/10 bg-ink/[0.02] px-4 pb-4 pt-3 sm:px-6">
                                        <OrderDetailPanel order={order} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}