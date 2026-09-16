export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";



export type RecentOrder = {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
};



export type OrderItem = {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
};

export type Order = {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
};