"use client";

import { useCallback, useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type { ID } from "@/types/inventory";
import type {
    CartID,
    CreateCartResponse,
    AddCartItemResponse,
    OrderPayload,
    OrderContactInput,
    CreateOrderResponse,
    AdminOrderListItem,
} from "@/types/orders";

function getErrorMessage(err: unknown, fallback: string): string {
    if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object"
    ) {
        const data = err.data as Record<string, unknown>;
        const firstValue = Object.values(data)[0];

        if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
            return firstValue[0];
        }

        if (typeof data.detail === "string") return data.detail;
        if (typeof data.message === "string") return data.message;
    }

    return fallback;
}

/** Minimal shape placeOrder needs from a cart line — matches CartContext's CartItem. */
export interface PlaceOrderLine {
    variantId: ID;
    quantity: number;
}

/* -------------------------------------------------------------------------- */
/*  Guest — place an order from the client-side cart                         */
/* -------------------------------------------------------------------------- */

/**
 * The storefront cart lives entirely in localStorage (see CartContext) — the
 * backend only learns about it at checkout time. This hook bridges the two:
 * it spins up a fresh server-side Cart, replays every local line into it via
 * the add-item endpoint, then creates the Order from that cart.
 */
export function usePlaceOrder() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const placeOrder = useCallback(
        async (
            items: PlaceOrderLine[],
            contact: OrderContactInput
        ): Promise<OrderPayload> => {
            setSubmitting(true);
            setError(null);

            try {
                if (!items.length) {
                    throw new Error("Your cart is empty.");
                }

                // 1. Create a fresh server-side cart.
                const cartRes = await apiFetch<CreateCartResponse>(
                    routes.orders.createCart,
                    { method: "POST", skipAuth: true }
                );
                const cartId: CartID = cartRes.cart_id;

                // 2. Replay each local line into it, one at a time so a
                //    single out-of-stock item reports clearly rather than
                //    failing silently inside a Promise.all.
                for (const line of items) {
                    await apiFetch<AddCartItemResponse>(
                        routes.orders.cartItems(cartId),
                        {
                            method: "POST",
                            skipAuth: true,
                            body: {
                                variant: line.variantId,
                                quantity: line.quantity,
                            },
                        }
                    );
                }

                // 3. Convert the cart into an order.
                const orderRes = await apiFetch<CreateOrderResponse>(
                    routes.orders.createOrder,
                    {
                        method: "POST",
                        skipAuth: true,
                        body: { cart_id: cartId, ...contact },
                    }
                );

                return orderRes.order;
            } catch (err) {
                const message = getErrorMessage(
                    err,
                    "Something went wrong placing your order. Please try again."
                );
                setError(message);
                throw new Error(message);
            } finally {
                setSubmitting(false);
            }
        },
        []
    );

    return { placeOrder, submitting, error };
}

/* -------------------------------------------------------------------------- */
/*  Guest — look up a single order (confirmation / "track my order")         */
/* -------------------------------------------------------------------------- */

export function useOrderLookup() {
    const [order, setOrder] = useState<OrderPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = useCallback(
        async (orderNumber: string, token: string) => {
            setLoading(true);
            setError(null);

            try {
                const data = await apiFetch<OrderPayload>(
                    routes.orders.orderDetail(orderNumber, token),
                    { skipAuth: true }
                );
                setOrder(data);
                return data;
            } catch (err) {
                setError(getErrorMessage(err, "Order not found"));
                setOrder(null);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { order, loading, error, fetchOrder };
}

/* -------------------------------------------------------------------------- */
/*  Admin — order listing                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Read-only by design. Order.status transitions automatically through the
 * M-Pesa callback (which also deducts inventory in the same step), so there
 * is no updateOrderStatus here — admins view orders, they don't set status.
 */
export function useAdminOrders() {
    const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<AdminOrderListItem[]>(
                routes.orders.adminOrders
            );
            setOrders(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load orders"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, fetchOrders };
}