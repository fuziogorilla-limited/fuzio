"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

// TODO: replace with your real backend base URL
const API_BASE = "https://api.example.com";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
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

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then((data: Order[]) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
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

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const prev = orders;
    setUpdatingId(id);
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setOrders(prev); // revert on failure
      alert("Couldn't update order status. Please try again.");
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
          Couldn&apos;t load orders right now. Please try again shortly.
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
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="max-w-[160px] truncate font-semibold">{o.customerName}</div>
                      <div className="truncate text-[11.5px] text-steel">{o.phone}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-steel sm:px-5">{fmtDate(o.createdAt)}</td>
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
                      {fmt(o.total)}
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        aria-label={`View order ${o.orderNumber}`}
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