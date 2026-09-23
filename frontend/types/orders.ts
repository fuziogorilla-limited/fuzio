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

export type OrderStatus =
    | "pending_payment"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "payment_failed";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending_payment: "Pending Payment",
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    payment_failed: "Payment Failed",
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

export interface UpdateOrderStatusResponse {
    message: string;
}