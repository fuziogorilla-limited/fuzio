/* =========================================================
   COMMON TYPES
========================================================= */

export type ID = number;

export type UUID = string;

export type DecimalString = string;

export type ISODateString = string;


/* =========================================================
   USER / AUTHENTICATION
========================================================= */

export interface User {
  id?: ID;
  first_name: string;
  last_name: string;
  email: string;
  date_registered?: ISODateString;
  date_updated?: ISODateString;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  access: string;
  refresh?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ApiMessageResponse {
  message: string;
}


/* =========================================================
   CATEGORY
========================================================= */

export interface Category {
  id: ID;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
  date_added: ISODateString;
}

export interface PublicCategory {
  id: ID;
  name: string;
  description: string;
  image: string | null;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: File | null;
  is_active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: File | null;
  is_active?: boolean;
}


/* =========================================================
   PRODUCT VARIANT
========================================================= */

export interface ProductVariant {
  id: ID;
  color: string;
  size: string;
  quantity: number;
  is_active: boolean;
}

/* =========================================================
   CATEGORY DRAFT
========================================================= */

export interface CategoryDraft {
  name: string;
  description: string;
  image: File | null;
  is_active: boolean;
}


/* =========================================================
   PRODUCT DRAFT
========================================================= */

export interface ProductDraft {
  category: ID | "";
  name: string;
  description: string;

  buying_price: DecimalString | number | "";
  selling_price: DecimalString | number | "";

  image: File | null;

  is_active: boolean;
  feature: boolean;

  variants: CreateProductVariantPayload[];

  // The admin form edits one variant at a time.
  color: string;
  size: string;
  quantity: string;
}

export interface CreateProductVariantPayload {
  color: string;
  size: string;
  quantity: number;
  is_active?: boolean;
}

export interface UpdateProductVariantPayload {
  id?: ID;
  color?: string;
  size?: string;
  quantity?: number;
  is_active?: boolean;
}


/* =========================================================
   PRODUCT
========================================================= */

export interface Product {
  id: ID;

  category: ID;

  name: string;

  description: string;

  buying_price: DecimalString;

  selling_price: DecimalString;

  image: string | null;

  is_active: boolean;

  feature: boolean;

  date_added: ISODateString;

  variants: ProductVariant[];

  total_quantity: number;

  total_value: DecimalString;
}

export interface PublicProduct {
  id: ID;

  category: ID;

  name: string;

  description: string;

  selling_price: DecimalString;

  image: string | null;

  is_active: boolean;

  feature: boolean;

  variants: ProductVariant[];
}

export interface CreateProductPayload {
  category: ID;

  name: string;

  description?: string;

  buying_price: DecimalString | number;

  selling_price: DecimalString | number;

  image?: File | null;

  is_active?: boolean;

  feature?: boolean;

  variants?: CreateProductVariantPayload[];
}

export interface UpdateProductPayload {
  category?: ID;

  name?: string;

  description?: string;

  buying_price?: DecimalString | number;

  selling_price?: DecimalString | number;

  image?: File | null;

  is_active?: boolean;

  feature?: boolean;

  variants?: UpdateProductVariantPayload[];
}


/* =========================================================
   CART
========================================================= */

export interface Cart {
  cart_id: UUID;

  created_at: ISODateString;

  is_checked_out: boolean;

  checked_out_at: ISODateString | null;

  items: CartItem[];
}

export interface CartItem {
  id?: ID;

  cart_id?: UUID;

  variant: ID;

  product_name?: string;

  color?: string;

  size?: string;

  quantity: number;

  price: DecimalString;

  total_price: DecimalString;
}

export interface CreateCartResponse {
  message: string;
  cart_id: UUID;
}

export interface AddCartItemPayload {
  variant: ID;
  quantity: number;
}

export interface AddCartItemResponse {
  message: string;

  item: {
    variant: ID;
    quantity: number;
    price: DecimalString;
    total_price: DecimalString;
  };
}

export interface CartResponse {
  cart_id: UUID;

  items: CartItem[];
}


/* =========================================================
   ORDER STATUS
========================================================= */

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "payment_failed";


/* =========================================================
   ORDER ITEM
========================================================= */

export interface OrderItem {
  id: ID;

  product_name: string;

  color: string;

  size: string;

  quantity: number;

  price: DecimalString;

  total_price: DecimalString;
}


/* =========================================================
   ORDER
========================================================= */

export interface Order {
  id?: ID;
  order_number: string;

  public_token: UUID;

  first_name: string;

  last_name: string;

  phone_number: string;

  email: string | null;

  county: string;

  town: string;

  address: string;

  additional_information: string | null;

  status: OrderStatus;

  total_amount: DecimalString;

  created_at: ISODateString;

  updated_at: ISODateString;

  items: OrderItem[];
}


/* =========================================================
   CREATE ORDER / CHECKOUT
========================================================= */

export interface CreateOrderPayload {
  cart_id: UUID;

  first_name: string;

  last_name: string;

  phone_number: string;

  email?: string;

  county: string;

  town: string;

  address: string;

  additional_information?: string;
}

export interface CreateOrderResponse {
  message: string;

  order: Order;
}


/* =========================================================
   ORDER LOOKUP
========================================================= */

export interface OrderLookupParams {
  order_number: string;

  token: UUID;
}


/* =========================================================
   ADMIN ORDER
========================================================= */

/*
  Your current ListOrdersSerializer uses:

      fields = "__all__"

  Therefore Django will return the database fields directly.

  This interface reflects the current Order model.
*/

export interface AdminOrder {
  id: ID;

  first_name: string;

  last_name: string;

  phone_number: string;

  email: string | null;

  county: string;

  town: string;

  address: string;

  additional_information: string | null;

  order_number: string;

  status: OrderStatus;

  total_amount: DecimalString;

  created_at: ISODateString;

  updated_at: ISODateString;

  public_token: UUID;

  items?: OrderItem[];
}


/* =========================================================
   ADMIN ORDER UPDATE
========================================================= */

/*
  NOTE:
  Your current backend still has:

      OrderUpdate
      is_delivered = BooleanField()

  But your final Order model no longer has `is_delivered`.

  Therefore this is the type for the backend you SHOULD use
  after changing OrderUpdate to update `status`.
*/

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}


/* =========================================================
   GENERIC API RESPONSES
========================================================= */

export interface CategoryResponse {
  message: string;
  category: Category;
}

export interface ProductResponse {
  message: string;
  product: Product;
}

export interface OrderStatusUpdateResponse {
  message: string;
}


/* =========================================================
   API ERROR TYPES
========================================================= */

export interface ApiError {
  detail?: string;

  message?: string;

  data?: Record<string, unknown> | null;

  [field: string]:
    | unknown;
}


/* =========================================================
   PAGINATION
========================================================= */

/*
  Your current Django endpoints do NOT use pagination.

  These are optional types for when you add DRF pagination later.
*/

export interface PaginatedResponse<T> {
  count: number;

  next: string | null;

  previous: string | null;

  results: T[];
}


/* =========================================================
   FRONTEND CART STATE
========================================================= */

/*
  These are frontend-only types.
  They are useful for Zustand, Context API, Redux, etc.
*/

export interface CartState {
  cartId: UUID | null;

  items: CartItem[];

  isLoading: boolean;

  error: string | null;
}


/* =========================================================
   CHECKOUT FORM
========================================================= */

export interface CheckoutFormData {
  firstName: string;

  lastName: string;

  phone: string;

  email: string;

  county: string;

  town: string;

  address: string;

  notes: string;
}

export type OrderResponse = Order;


/* =========================================================
   PRODUCT FILTERS
========================================================= */

export interface ProductFilters {
  category?: ID;

  feature?: boolean;

  search?: string;

  color?: string;

  size?: string;

  min_price?: number;

  max_price?: number;
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export interface DashboardStats {
  total_products?: number;

  total_categories?: number;

  total_orders?: number;

  pending_orders?: number;

  paid_orders?: number;

  processing_orders?: number;

  shipped_orders?: number;

  delivered_orders?: number;

  cancelled_orders?: number;

  total_revenue?: DecimalString;
}

export type SortOption = "default" | "low" | "high";

export type ProcessStep = {
  title: string;
  body: string;
};

export type AboutCheckItem = {
  label: string;
};

export type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

export type CartLine = {
  pid: string;
  name: string;
  price: number;
  icon?: string;
  qty: number;
  size?: string | null;
  color?: string | null;
};

export type AddToCartInput = Omit<CartLine, "qty"> & {
  qty?: number;
};

export type AdminAuthStep =
  | "login"
  | "forgot-email"
  | "forgot-code";

export interface AdminAuthError {
  status?: number;
  data?: {
    message?: string;
    detail?: string;
    [key: string]: unknown;
  } | null;
}

export interface AdminProduct {
  id: ID;
  is_active: boolean;
}

export interface RecentOrder {
  id?: ID;
  order_number: string;
  first_name: string;
  last_name: string;
  status: OrderStatus;
  created_at: ISODateString;
  total_amount: DecimalString;
  items?: OrderItem[];
}


/* =========================================================
   TYPE GUARDS / HELPERS
========================================================= */

export const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "payment_failed",
];

export function isOrderStatus(
  value: string
): value is OrderStatus {
  return ORDER_STATUSES.includes(
    value as OrderStatus
  );
}
