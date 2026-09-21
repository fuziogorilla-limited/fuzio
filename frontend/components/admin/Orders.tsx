"use client";

import Link from "next/link";
import { FaEye } from "react-icons/fa";

import { useOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types/fields";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending_payment",
  "processing",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "payment_failed",
];

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  paid: "bg-green/15 text-green",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green/15 text-green",
  payment_failed: "bg-red-100 text-red-600",
  cancelled: "bg-red-100 text-red-600",
};

const ORDER_MESSAGES = {
  loadError: "Couldn't load orders right now.",
  empty: "No orders found.",
} as const;

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Orders() {
  const {
    filteredOrders,
    loading,
    error,
    statusFilter,
    updatingId,
    setStatusFilter,
    handleStatusChange,
  } = useOrders();

  return (
    <div className="w-full min-w-0">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | OrderStatus
            )
          }
          className="border border-ink/15 bg-paper px-3 py-2.5 text-[13px] font-medium outline-none"
        >
          <option value="all">All Statuses</option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status[0].toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <span className="text-[12.5px] text-steel">
          {filteredOrders.length} order
          {filteredOrders.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {error || ORDER_MESSAGES.loadError}
        </p>
      )}

      {/* Orders table */}
      <div className="border border-ink/10 bg-paper">
        {/* Loading */}
        {loading && (
          <div className="p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="mb-3 h-12 w-full animate-pulse bg-bg last:mb-0"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredOrders.length === 0 && (
            <p className="p-5 text-[13px] text-steel">
              {ORDER_MESSAGES.empty}
            </p>
          )}

        {/* Table */}
        {!loading &&
          !error &&
          filteredOrders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-[11px] font-bold uppercase tracking-wide text-steel">
                    <th className="px-4 py-3 sm:px-5">
                      Order
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Customer
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Date
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right sm:px-5">
                      Total
                    </th>

                    <th className="px-4 py-3 text-right sm:px-5">
                      View
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-ink/5 last:border-none hover:bg-bg"
                    >
                      {/* Order number */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-semibold sm:px-5">
                        {order.order_number}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3 sm:px-5">
                        <div className="max-w-[160px] truncate font-semibold">
                          {order.first_name}{" "}
                          {order.last_name}
                        </div>

                        <div className="truncate text-[11.5px] text-steel">
                          {order.phone_number}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 text-steel sm:px-5">
                        {formatOrderDate(
                          order.created_at
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 sm:px-5">
                        <select
                          value={order.status}
                          disabled={
                            updatingId === order.id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value as OrderStatus
                            )
                          }
                          className={`rounded-full border-0 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide outline-none disabled:opacity-50 ${
                            ORDER_STATUS_STYLES[
                              order.status
                            ]
                          }`}
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      {/* Total */}
                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold sm:px-5">
                        {formatPrice(Number(order.total_amount))}
                      </td>

                      {/* View */}
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Link
                          href={`/admin/orders/${order.order_number}`}
                          aria-label={`View order ${order.order_number}`}
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