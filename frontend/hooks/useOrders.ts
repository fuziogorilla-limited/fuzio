import { useEffect, useMemo, useState } from "react";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type { Order, OrderStatus } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Order[]>(routes.orders.adminList)
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Couldn't load orders — this needs an admin order-list endpoint on the backend."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (
    id: number,
    status: OrderStatus
  ) => {
    const previousOrders = orders;

    setUpdatingId(id);

    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );

    try {
      await apiFetch(routes.orders.adminUpdateStatus(id), {
        method: "PATCH",
        body: { status },
      });
    } catch {
      setOrders(previousOrders);

      alert(
        "Couldn't update order status — this needs a status field and update endpoint on the backend Order model."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    orders,
    filteredOrders,
    loading,
    error,
    statusFilter,
    updatingId,
    setStatusFilter,
    handleStatusChange,
  };
}