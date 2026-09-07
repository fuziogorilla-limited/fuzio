"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaHourglassHalf,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";

// TODO: replace with your real backend base URL
const API_BASE = "https://api.example.com";

type DashboardStats = {
  totalRevenue: number;
  ordersToday: number;
  pendingOrders: number;
  totalProducts: number;
};

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

type RecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

function fmt(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green/15 text-green",
  cancelled: "bg-red-100 text-red-600",
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`${API_BASE}/admin/dashboard/stats`, { headers: authHeaders() }).then((res) => {
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      }),
      fetch(`${API_BASE}/admin/orders?limit=5`, { headers: authHeaders() }).then((res) => {
        if (!res.ok) throw new Error("Failed to load recent orders");
        return res.json();
      }),
    ])
      .then(([statsData, ordersData]) => {
        if (cancelled) return;
        setStats(statsData);
        setOrders(ordersData);
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

  const statCards = stats
    ? [
        { label: "Total Revenue", value: fmt(stats.totalRevenue), icon: FaMoneyBillWave },
        { label: "Orders Today", value: stats.ordersToday.toString(), icon: FaClipboardList },
        { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: FaHourglassHalf },
        { label: "Total Products", value: stats.totalProducts.toString(), icon: FaBoxOpen },
      ]
    : [];

  return (
    <div className="w-full min-w-0">
      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[92px] w-full animate-pulse border border-ink/10 bg-paper" />
          ))}

        {!loading &&
          !error &&
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

      {error && (
        <p className="mb-6 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          Couldn&apos;t load dashboard data right now. Please try again shortly.
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

        {!loading && !error && orders.length === 0 && (
          <p className="p-5 text-[13px] text-steel">No orders yet.</p>
        )}

        {!loading && !error && orders.length > 0 && (
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
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-ink/5 last:border-none hover:bg-bg">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-semibold sm:px-5">
                      {o.orderNumber}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 sm:px-5">{o.customerName}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${STATUS_STYLES[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold sm:px-5">
                      {fmt(o.total)}
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