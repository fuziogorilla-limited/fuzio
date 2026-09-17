import type { OrderStatus } from "@/types/fields";

export const STATUS_OPTIONS: OrderStatus[] = [
  "pending_payment",
  "processing",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "payment_failed",
];

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  paid: "bg-green/15 text-green",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green/15 text-green",
  payment_failed: "bg-red-100 text-red-600",
  cancelled: "bg-red-100 text-red-600",
};

export const ORDER_MESSAGES = {
  loadError:
    "Couldn't load orders — this needs an admin order-list endpoint on the backend.",
  updateError:
    "Couldn't update order status — this needs a status field and update endpoint on the backend Order model.",
  empty: "No orders found.",
} as const;