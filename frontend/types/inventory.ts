export type ID = number;

// Category

export interface CategoryPayload {
    id: ID;
    name: string;
    description: string;
    image: string | null;
    is_active: boolean;
    date_added: string; // ISO datetime
}

export interface CategoryCreateInput {
    name: string;
    description?: string;
    image?: File | null;
}

// Color

export interface ColorPayload {
    id: ID;
    name: string;
    created_at: string;
}

export interface ColorCreateInput {
    name: string;
}

// Size

export interface SizePayload {
    id: ID;
    name: string;
    created_at: string;
}

export interface SizeCreateInput {
    name: string;
}

// Product

export interface ProductPayload {
    id: ID;
    category: ID;
    name: string;
    description: string;
    image: string | null;
    is_active: boolean;
    feature: boolean;
    date_added: string;
}

export interface ProductCreateInput {
    name: string;
    category: ID;
    description: string;
    image?: File | null;
    feature?: boolean;
    is_active?: boolean;
}

// Product Variant

export interface ProductVariantPayload {
    id: ID;
    product: ID;
    color: ID;
    size: ID;
    sku: string;
    quantity: number;
    selling_price: string;
    buying_price: string;
    is_active: boolean;
}

export interface ProductVariantCreateInput {
    product: ID;
    color: ID;
    size: ID;
    quantity: number;
    selling_price: number | string;
    buying_price: number | string;
    sku: string;
}

// Guest (public) shapes

/** GuestProductSerializer -> Product minus `date_added` */
export type GuestProduct = Omit<ProductPayload, "date_added">;

/** GuestProductVariantSerializer -> ProductVariant minus `buying_price` */
export type GuestProductVariant = Omit<ProductVariantPayload, "buying_price">;

// Envelope shapes returned by the admin endpoints
/** POST / PATCH responses: `{ message, data }` */
export interface ApiMessageResponse<T> {
    message: string;
    data: T;
}

/** DELETE responses: `{ message }` */
export interface ApiDeleteResponse {
    message: string;
}