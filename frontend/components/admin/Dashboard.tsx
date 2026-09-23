"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
    FaBoxOpen,
    FaLayerGroup,
    FaClipboardList,
    FaMoneyBillWave,
    FaExclamationTriangle,
    FaTags,
    FaArrowRight,
} from "react-icons/fa";

import {
    useProducts,
    useCategories,
    useProductVariants,
} from "@/hooks/useInventory";
import { useAdminOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/orders";

const LOW_STOCK_THRESHOLD = 5;
const RECENT_ORDERS_COUNT = 6;
const LOW_STOCK_DISPLAY_COUNT = 6;

// Statuses that count as real revenue — an unpaid or failed order shouldn't
// inflate the number the moment it's created.
const REVENUE_STATUSES: OrderStatus[] = [
    "paid",
    "processing",
    "shipped",
    "delivered",
];

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
    return new Date(iso).toLocaleDateString("en-KE", {
        day: "2-digit",
        month: "short",
    });
}

/* -------------------------------------------------------------------------- */
/*  Stat card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
    icon,
    label,
    value,
    sublabel,
    loading,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sublabel?: string;
    loading: boolean;
}) {
    return (
        <div className="bg-paper p-5">
            <div className="mb-4 flex h-9 w-9 items-center justify-center bg-accent text-ink">
                {icon}
            </div>

            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-steel">
                {label}
            </div>

            {loading ? (
                <div className="mt-2 h-7 w-20 animate-pulse bg-ink/5" />
            ) : (
                <div className="mt-1 text-2xl font-black tracking-tight text-ink">
                    {value}
                </div>
            )}

            {sublabel && !loading && (
                <div className="mt-1 text-[12px] text-steel">{sublabel}</div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
    const { products, loading: productsLoading } = useProducts();
    const { categories, loading: categoriesLoading } = useCategories();
    const { variants, loading: variantsLoading } = useProductVariants();
    const { orders, loading: ordersLoading } = useAdminOrders();

    const productMap = useMemo(
        () => new Map(products.map((p) => [p.id, p.name])),
        [products]
    );

    const stats = useMemo(() => {
        const activeProducts = products.filter((p) => p.is_active).length;

        const activeVariants = variants.filter((v) => v.is_active);
        const lowStock = activeVariants
            .filter(
                (v) => v.quantity > 0 && v.quantity <= LOW_STOCK_THRESHOLD
            )
            .sort((a, b) => a.quantity - b.quantity);
        const outOfStock = activeVariants.filter((v) => v.quantity === 0);

        const pendingOrders = orders.filter(
            (o) => o.status === "pending_payment"
        ).length;

        const revenue = orders
            .filter((o) => REVENUE_STATUSES.includes(o.status))
            .reduce((sum, o) => sum + Number(o.total_amount), 0);

        const recentOrders = [...orders]
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            )
            .slice(0, RECENT_ORDERS_COUNT);

        return {
            activeProducts,
            lowStock,
            outOfStock,
            pendingOrders,
            revenue,
            recentOrders,
        };
    }, [products, variants, orders]);

    const inventoryLoading = productsLoading || variantsLoading;

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-[1240px]">
                {/* Header */}
                <div className="mb-6">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                        Overview
                    </div>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-ink">
                        Dashboard
                    </h1>
                </div>

                {/* Stat cards */}
                <div className="mb-8 grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<FaMoneyBillWave size={15} />}
                        label="Revenue"
                        value={formatPrice(stats.revenue)}
                        sublabel="Paid & fulfilled orders"
                        loading={ordersLoading}
                    />

                    <StatCard
                        icon={<FaClipboardList size={15} />}
                        label="Orders"
                        value={String(orders.length)}
                        sublabel={
                            stats.pendingOrders > 0
                                ? `${stats.pendingOrders} pending payment`
                                : "All caught up"
                        }
                        loading={ordersLoading}
                    />

                    <StatCard
                        icon={<FaBoxOpen size={15} />}
                        label="Products"
                        value={String(products.length)}
                        sublabel={`${stats.activeProducts} active`}
                        loading={productsLoading}
                    />

                    <StatCard
                        icon={<FaTags size={15} />}
                        label="Categories"
                        value={String(categories.length)}
                        loading={categoriesLoading}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    {/* Recent orders */}
                    <div className="border border-ink/10 bg-paper">
                        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                            <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                                Recent Orders
                            </h2>

                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-accent-dark transition-colors hover:text-ink"
                            >
                                View All
                                <FaArrowRight size={9} />
                            </Link>
                        </div>

                        {ordersLoading && (
                            <div className="p-6 text-sm text-steel">
                                Loading orders...
                            </div>
                        )}

                        {!ordersLoading && stats.recentOrders.length === 0 && (
                            <div className="flex flex-col items-center gap-2 p-10 text-center text-steel">
                                <FaClipboardList size={20} />
                                <p className="text-sm">No orders yet.</p>
                            </div>
                        )}

                        {stats.recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center gap-4 border-b border-ink/10 px-5 py-3.5 last:border-b-0"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-[12.5px] font-bold text-ink">
                                            {order.order_number}
                                        </span>

                                        <span
                                            className={`px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wide ${
                                                STATUS_STYLES[order.status]
                                            }`}
                                        >
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </span>
                                    </div>

                                    <p className="mt-0.5 truncate text-[12px] text-steel">
                                        {order.first_name} {order.last_name}{" "}
                                        &middot; {formatDate(order.created_at)}
                                    </p>
                                </div>

                                <span className="flex-shrink-0 font-mono text-[13px] font-bold text-ink">
                                    {formatPrice(order.total_amount)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Stock alerts */}
                    <div className="border border-ink/10 bg-paper">
                        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                            <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                                Stock Alerts
                            </h2>

                            <Link
                                href="/admin/products"
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-accent-dark transition-colors hover:text-ink"
                            >
                                Manage
                                <FaArrowRight size={9} />
                            </Link>
                        </div>

                        {inventoryLoading && (
                            <div className="p-6 text-sm text-steel">
                                Loading stock levels...
                            </div>
                        )}

                        {!inventoryLoading &&
                            stats.lowStock.length === 0 &&
                            stats.outOfStock.length === 0 && (
                                <div className="flex flex-col items-center gap-2 p-10 text-center text-steel">
                                    <FaLayerGroup size={20} />
                                    <p className="text-sm">
                                        Stock levels look healthy.
                                    </p>
                                </div>
                            )}

                        {!inventoryLoading && stats.outOfStock.length > 0 && (
                            <div className="border-b border-ink/10 px-5 py-3">
                                <div className="mb-2 flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wide text-red-600">
                                    <FaExclamationTriangle size={10} />
                                    Out of Stock ({stats.outOfStock.length})
                                </div>

                                <ul className="space-y-1.5">
                                    {stats.outOfStock
                                        .slice(0, LOW_STOCK_DISPLAY_COUNT)
                                        .map((variant) => (
                                            <li
                                                key={variant.id}
                                                className="flex justify-between text-[12.5px]"
                                            >
                                                <span className="truncate text-ink">
                                                    {productMap.get(
                                                        variant.product
                                                    ) ?? "Unknown product"}
                                                </span>
                                                <span className="flex-shrink-0 font-mono text-red-600">
                                                    {variant.sku}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}

                        {!inventoryLoading && stats.lowStock.length > 0 && (
                            <div className="px-5 py-3">
                                <div className="mb-2 flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wide text-accent-dark">
                                    <FaExclamationTriangle size={10} />
                                    Low Stock ({stats.lowStock.length})
                                </div>

                                <ul className="space-y-1.5">
                                    {stats.lowStock
                                        .slice(0, LOW_STOCK_DISPLAY_COUNT)
                                        .map((variant) => (
                                            <li
                                                key={variant.id}
                                                className="flex justify-between text-[12.5px]"
                                            >
                                                <span className="truncate text-ink">
                                                    {productMap.get(
                                                        variant.product
                                                    ) ?? "Unknown product"}
                                                </span>
                                                <span className="flex-shrink-0 font-mono text-accent-dark">
                                                    {variant.quantity} left
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}