export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  address: string;
  notes: string;
};

export type OrderItemResponse = {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
};

export type OrderResponse = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string | null;
  county: string;
  town: string;
  address: string;
  additional_information: string | null;
  order_number: string;
  created_at: string;
  items: OrderItemResponse[];
};