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