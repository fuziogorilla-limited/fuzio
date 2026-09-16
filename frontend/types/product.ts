export type Product = {
  id: number;
  category: number;
  name: string;
  description: string;
  buying_price: string;
  selling_price: string;
  color: string;
  size: string;
  quantity: number;
  is_active: boolean;
  date_added: string;
  feature: boolean;
};

export type ProductDraft = {
  category: number | "";
  name: string;
  description: string;
  buying_price: string;
  selling_price: string;
  color: string;
  size: string;
  quantity: string;
  is_active: boolean;
  feature: boolean;
};