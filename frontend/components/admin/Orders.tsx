"use client";

/**
 * BACKEND TODO — this component currently has nothing real to call:
 *
 * 1. There is no admin "list all orders" endpoint. `OrderApiView` only
 *    defines `post()` (create order). You need a `get()` on an admin-only
 *    view that returns all Orders (with their items), e.g. add a `get()`
 *    to `OrderApiView` guarded by `IsAdminUser`, or a new
 *    `AdminOrderListApiView`.
 * 2. The `Order` model has no `status` field at all, so there's nothing to
 *    filter or update here yet. Add something like:
 *      status = models.CharField(max_length=20, choices=[...], default="pending")
 *    plus a migration, then a PATCH endpoint to update it.
 *
 * Until those exist, this page will show a "couldn't load" state — that's
 * expected, not a frontend bug. `routes.orders.adminList` /
 * `routes.orders.adminUpdateStatus` in lib/routes.ts are placeholders for
 * the URLs those new views should live at.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// Shape this component *wants* once the backend supports it. Adjust to
// match whatever the real endpoint ends up returning.
type OrderItem = {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
};

type Order = {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
};

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "completed", "cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green/15 text-green",
  cancelled: "bg-red-100 text-red-600",
};

function fmt(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

function orderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Order[]>(routes.orders.adminList)
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Couldn't load orders — this needs an admin order-list endpoint on the backend (see comment at top of Orders.tsx)."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter)),
    [orders, statusFilter]
  );

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    const prev = orders;
    setUpdatingId(id);
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await apiFetch(routes.orders.adminUpdateStatus(id), {
        method: "PATCH",
        body: { status },
      });
    } catch {
      setOrders(prev); // revert on failure
      alert(
        "Couldn't update order status — this needs a `status` field and update endpoint on the backend Order model."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | OrderStatus)}
          className="border border-ink/15 bg-paper px-3 py-2.5 text-[13px] font-medium outline-none"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <span className="text-[12.5px] text-steel">{filtered.length} order{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {error && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {error}
        </p>
      )}

      <div className="border border-ink/10 bg-paper">
        {loading && (
          <div className="p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-3 h-12 w-full animate-pulse bg-bg last:mb-0" />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No orders found.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-ink/10 text-left text-[11px] font-bold uppercase tracking-wide text-steel">
                  <th className="px-4 py-3 sm:px-5">Order</th>
                  <th className="px-4 py-3 sm:px-5">Customer</th>
                  <th className="px-4 py-3 sm:px-5">Date</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                  <th className="px-4 py-3 text-right sm:px-5">Total</th>
                  <th className="px-4 py-3 text-right sm:px-5">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-ink/5 last:border-none hover:bg-bg">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-semibold sm:px-5">
                      {o.order_number}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="max-w-[160px] truncate font-semibold">
                        {o.first_name} {o.last_name}
                      </div>
                      <div className="truncate text-[11.5px] text-steel">{o.phone_number}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-steel sm:px-5">{fmtDate(o.created_at)}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`rounded-full border-0 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide outline-none disabled:opacity-50 ${STATUS_STYLES[o.status]}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold sm:px-5">
                      {fmt(orderTotal(o))}
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <Link
                        href={`/admin/orders/${o.order_number}`}
                        aria-label={`View order ${o.order_number}`}
                        className="inline-flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                      >
                        <FaEye size={13} />
                      </Link>
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