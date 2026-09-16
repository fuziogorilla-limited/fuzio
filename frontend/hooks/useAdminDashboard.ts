"use client";

import { useEffect, useState } from "react";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

import type { AdminProduct } from "@/types/admin";
import type { RecentOrder } from "@/types/order";

function orderTotal(order: RecentOrder) {
  return order.items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );
}

export function useAdminDashboard() {
  const [totalProducts, setTotalProducts] =
    useState<number | null>(null);

  const [productsError, setProductsError] =
    useState(false);

  const [orders, setOrders] =
    useState<RecentOrder[] | null>(null);

  const [ordersError, setOrdersError] =
    useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const productsPromise = apiFetch<AdminProduct[]>(
      routes.inventory.products
    )
      .then((data) => {
        if (!cancelled) {
          setTotalProducts(data.length);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProductsError(true);
        }
      });

    const ordersPromise = apiFetch<RecentOrder[]>(
      routes.orders.adminList
    )
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrdersError(true);
        }
      });

    Promise.all([
      productsPromise,
      ordersPromise,
    ]).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toDateString();

  const ordersToday =
    orders?.filter(
      (order) =>
        new Date(order.created_at).toDateString() ===
        today
    ).length ?? null;

  const pendingOrders =
    orders?.filter(
      (order) => order.status === "pending"
    ).length ?? null;

  const totalRevenue =
    orders?.reduce(
      (sum, order) => sum + orderTotal(order),
      0
    ) ?? null;

  const recentOrders =
    orders?.slice(0, 5) ?? [];

  return {
    totalProducts,
    productsError,

    orders,
    ordersError,

    loading,

    ordersToday,
    pendingOrders,
    totalRevenue,
    recentOrders,

    orderTotal,
  };
}