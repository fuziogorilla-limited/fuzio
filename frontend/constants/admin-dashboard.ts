import type { OrderStatus } from "@/types/order";

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent-dark",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green/15 text-green",
  cancelled: "bg-red-100 text-red-600",
};

export const DASHBOARD_MESSAGES = {
  ordersError:
    "Revenue and order stats need an admin order-list endpoint on the backend — see the dashboard backend requirements.",
  productsError:
    "Couldn't load product count right now.",
  ordersUnavailable:
    "Recent orders aren't available yet.",
  noOrders:
    "No orders yet.",
} as const;