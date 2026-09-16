import type { OrderStatus } from "@/types/order";

export const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green/15 text-green",
  cancelled: "bg-red-100 text-red-600",
};

export const ORDER_MESSAGES = {
  loadError:
    "Couldn't load orders — this needs an admin order-list endpoint on the backend.",
  updateError:
    "Couldn't update order status — this needs a status field and update endpoint on the backend Order model.",
  empty: "No orders found.",
} as const;