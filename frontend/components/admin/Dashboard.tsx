"use client";

import Link from "next/link";

import {
  FaMoneyBillWave,
  FaClipboardList,
  FaHourglassHalf,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { formatPrice } from "@/lib/utils";

const DASHBOARD_MESSAGES = {
  ordersError: "Revenue and order stats are unavailable right now.",
  productsError: "Couldn't load product count right now.",
  ordersUnavailable: "Recent orders aren't available yet.",
  noOrders: "No orders yet.",
} as const;

const ORDER_STATUS_STYLES = {
  pending_payment: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  paid: "bg-green/15 text-green",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green/15 text-green",
  payment_failed: "bg-red-100 text-red-600",
  cancelled: "bg-red-100 text-red-600",
} as const;

export default function Dashboard() {
  const {
    totalProducts,
    productsError,

    ordersError,

    loading,

    ordersToday,
    pendingOrders,
    totalRevenue,
    recentOrders,

    orderTotal,
  } = useAdminDashboard();

  const statCards = [
    {
      label: "Total Revenue",
      value:
        totalRevenue !== null
          ? formatPrice(totalRevenue)
          : "—",
      icon: FaMoneyBillWave,
      unavailable: ordersError,
    },
    {
      label: "Orders Today",
      value:
        ordersToday !== null
          ? ordersToday.toString()
          : "—",
      icon: FaClipboardList,
      unavailable: ordersError,
    },
    {
      label: "Pending Orders",
      value:
        pendingOrders !== null
          ? pendingOrders.toString()
          : "—",
      icon: FaHourglassHalf,
      unavailable: ordersError,
    },
    {
      label: "Total Products",
      value:
        totalProducts !== null
          ? totalProducts.toString()
          : "—",
      icon: FaBoxOpen,
      unavailable: productsError,
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[92px] w-full animate-pulse border border-ink/10 bg-paper"
            />
          ))}

        {!loading &&
          statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3.5 border border-ink/10 bg-paper p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-accent">
                <stat.icon size={17} />
              </div>

              <div className="min-w-0">
                <div className="truncate font-mono text-lg font-bold text-ink">
                  {stat.value}
                </div>

                <div className="truncate text-[11.5px] font-semibold uppercase tracking-wide text-steel">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* API errors */}
      {!loading && ordersError && (
        <p className="mb-6 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {DASHBOARD_MESSAGES.ordersError}
        </p>
      )}

      {!loading && productsError && (
        <p className="mb-6 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {DASHBOARD_MESSAGES.productsError}
        </p>
      )}

      {/* Recent orders */}
      <div className="border border-ink/10 bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3.5 sm:px-5">
          <h2 className="text-[14px] font-extrabold text-ink">
            Recent Orders
          </h2>

          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-accent-dark hover:text-ink"
          >
            View all
            <FaArrowRight size={10} />
          </Link>
        </div>

        {loading && (
          <div className="p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="mb-3 h-10 w-full animate-pulse bg-bg last:mb-0"
              />
            ))}
          </div>
        )}

        {!loading && ordersError && (
          <p className="p-5 text-[13px] text-steel">
            {DASHBOARD_MESSAGES.ordersUnavailable}
          </p>
        )}

        {!loading &&
          !ordersError &&
          recentOrders.length === 0 && (
            <p className="p-5 text-[13px] text-steel">
              {DASHBOARD_MESSAGES.noOrders}
            </p>
          )}

        {!loading &&
          !ordersError &&
          recentOrders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-[11px] font-bold uppercase tracking-wide text-steel">
                    <th className="px-4 py-3 sm:px-5">
                      Order
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Customer
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right sm:px-5">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-ink/5 last:border-none hover:bg-bg"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-semibold sm:px-5">
                        {order.order_number}
                      </td>

                      <td className="max-w-[160px] truncate px-4 py-3 sm:px-5">
                        {order.first_name}{" "}
                        {order.last_name}
                      </td>

                      <td className="px-4 py-3 sm:px-5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
                            ORDER_STATUS_STYLES[
                              order.status
                            ]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold sm:px-5">
                        {formatPrice(
                          orderTotal(order)
                        )}
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