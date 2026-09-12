"use client";

/**
 * BACKEND TODO: "Orders Today", "Pending Orders" and "Total Revenue" all
 * need order data the backend doesn't expose yet — see the comment block
 * at the top of Orders.tsx for exactly what's missing (admin order-list
 * endpoint + a `status` field on Order). "Total Products" is real today
 * since it comes straight from GET /api/inventory/products/.
 *
 * Once routes.orders.adminList and routes.orders.adminStats exist on the
 * backend, swap the placeholder values below for real ones.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaHourglassHalf,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

type Product = {
  id: number;
  is_active: boolean;
};

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

type OrderItem = {
  price: string;
  quantity: number;
};

type RecentOrder = {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green/15 text-green",
  cancelled: "bg-red-100 text-red-600",
};

function fmt(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

function orderTotal(order: RecentOrder) {
  return order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
}

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [productsError, setProductsError] = useState(false);

  const [orders, setOrders] = useState<RecentOrder[] | null>(null);
  const [ordersError, setOrdersError] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const productsPromise = apiFetch<Product[]>(routes.inventory.products)
      .then((data) => {
        if (!cancelled) setTotalProducts(data.length);
      })
      .catch(() => {
        if (!cancelled) setProductsError(true);
      });

    const ordersPromise = apiFetch<RecentOrder[]>(routes.orders.adminList)
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setOrdersError(true);
      });

    Promise.all([productsPromise, ordersPromise]).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toDateString();
  const ordersToday = orders?.filter((o) => new Date(o.created_at).toDateString() === today).length ?? null;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length ?? null;
  const totalRevenue = orders?.reduce((sum, o) => sum + orderTotal(o), 0) ?? null;
  const recentOrders = orders?.slice(0, 5) ?? [];

  const statCards = [
    {
      label: "Total Revenue",
      value: totalRevenue !== null ? fmt(totalRevenue) : "—",
      icon: FaMoneyBillWave,
      unavailable: ordersError,
    },
    {
      label: "Orders Today",
      value: ordersToday !== null ? ordersToday.toString() : "—",
      icon: FaClipboardList,
      unavailable: ordersError,
    },
    {
      label: "Pending Orders",
      value: pendingOrders !== null ? pendingOrders.toString() : "—",
      icon: FaHourglassHalf,
      unavailable: ordersError,
    },
    {
      label: "Total Products",
      value: totalProducts !== null ? totalProducts.toString() : "—",
      icon: FaBoxOpen,
      unavailable: productsError,
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[92px] w-full animate-pulse border border-ink/10 bg-paper" />
          ))}

        {!loading &&
          statCards.map((s) => (
            <div key={s.label} className="flex items-center gap-3.5 border border-ink/10 bg-paper p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-accent">
                <s.icon size={17} />
              </div>
              <div className="min-w-0">
                <div className="truncate font-mono text-lg font-bold text-ink">{s.value}</div>
                <div className="truncate text-[11.5px] font-semibold uppercase tracking-wide text-steel">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
      </div>

      {!loading && ordersError && (
        <p className="mb-6 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          Revenue and order stats need an admin order-list endpoint on the backend — see the comment at the top of
          this file.
        </p>
      )}
      {!loading && productsError && (
        <p className="mb-6 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          Couldn&apos;t load product count right now.
        </p>
      )}

      {/* Recent orders */}
      <div className="border border-ink/10 bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3.5 sm:px-5">
          <h2 className="text-[14px] font-extrabold text-ink">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-accent-dark hover:text-ink"
          >
            View all <FaArrowRight size={10} />
          </Link>
        </div>

        {loading && (
          <div className="p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-3 h-10 w-full animate-pulse bg-bg last:mb-0" />
            ))}
          </div>
        )}

        {!loading && ordersError && (
          <p className="p-5 text-[13px] text-steel">Recent orders aren&apos;t available yet.</p>
        )}

        {!loading && !ordersError && recentOrders.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No orders yet.</p>
        )}

        {!loading && !ordersError && recentOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-ink/10 text-left text-[11px] font-bold uppercase tracking-wide text-steel">
                  <th className="px-4 py-3 sm:px-5">Order</th>
                  <th className="px-4 py-3 sm:px-5">Customer</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                  <th className="px-4 py-3 text-right sm:px-5">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-ink/5 last:border-none hover:bg-bg">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-semibold sm:px-5">
                      {o.order_number}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 sm:px-5">
                      {o.first_name} {o.last_name}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${STATUS_STYLES[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold sm:px-5">
                      {fmt(orderTotal(o))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}