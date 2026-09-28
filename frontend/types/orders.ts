import type { ID } from "./inventory";

/* -------------------------------------------------------------------------- */
/*  Cart                                                                      */
/* -------------------------------------------------------------------------- */

/** UUID primary key of orders.Cart. */
export type CartID = string;

export interface CreateCartResponse {
    message: string;
    cart_id: CartID;
}

export interface CartItemLine {
    variant: ID;
    /** Only present on the cart-detail GET, not on the add-item response. */
    product_name?: string;
    quantity: number;
    price: string;
    total_price: string;
}

export interface AddCartItemInput {
    variant: ID;
    quantity: number;
}

export interface AddCartItemResponse {
    message: string;
    item: CartItemLine;
}

export interface CartDetailResponse {
    cart_id: CartID;
    items: CartItemLine[];
}

/* -------------------------------------------------------------------------- */
/*  Orders                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Mirrors orders.models.Order.Status exactly. This is intentionally
 * read-only from the admin panel's perspective — the backend is the only
 * thing that ever changes it:
 * - "pending_payment" on creation
 * - "paid" set by PaymentStatusApiView when the M-Pesa callback succeeds,
 *   in the same transaction that deducts inventory
 * - "cancelled" — a valid choice, but nothing currently sets it automatically
 *
 * There is no "payment_failed" order status: a failed M-Pesa attempt only
 * updates CustomerPayment.status to "FAILED" (a separate model, keyed by
 * checkout_request_id) and leaves the Order at "pending_payment" so the
 * customer can retry. There are also no "processing" / "shipped" /
 * "delivered" states — those would need to be added to Order.Status on the
 * backend (with a migration) before they could be added here.
 */
export type OrderStatus = "pending_payment" | "paid" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending_payment: "Pending Payment",
    paid: "Paid",
    cancelled: "Cancelled",
};

export interface OrderItemPayload {
    id: ID;
    product_name: string;
    color: string;
    size: string;
    quantity: number;
    price: string;
    total_price: string;
}

/** OrderSerializer — returned from create-order and the guest order-detail lookup. */
export interface OrderPayload {
    order_number: string;
    public_token: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string | null;
    county: string;
    town: string;
    address: string;
    additional_information: string | null;
    status: OrderStatus;
    total_amount: string;
    created_at: string;
    updated_at: string;
    items: OrderItemPayload[];
}

/** Everything CreateOrderSerializer needs, minus the cart_id (the hook adds that). */
export interface OrderContactInput {
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
    county: string;
    town: string;
    address: string;
    additional_information?: string;
}

export interface CreateOrderInput extends OrderContactInput {
    cart_id: CartID;
}

export interface CreateOrderResponse {
    message: string;
    order: OrderPayload;
}

/* -------------------------------------------------------------------------- */
/*  Admin                                                                     */
/* -------------------------------------------------------------------------- */

/** ListOrdersSerializer -> Order, flat (no nested items). */
export interface AdminOrderListItem {
    id: ID;
    order_number: string;
    public_token: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string | null;
    county: string;
    town: string;
    address: string;
    additional_information: string | null;
    status: OrderStatus;
    total_amount: string;
    created_at: string;
    updated_at: string;
}