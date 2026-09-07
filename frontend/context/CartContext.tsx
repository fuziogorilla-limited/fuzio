"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type CartLine = {
  pid: string;
  name: string;
  price: number;
  icon?: string; // emoji/icon placeholder until real product images are wired up
  qty: number;
  size?: string | null;
  color?: string | null;
};

type CartContextValue = {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  changeQty: (index: number, delta: number) => void;
  removeLine: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart: CartContextValue["addToCart"] = (line) => {
    const qty = line.qty ?? 1;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (l) => l.pid === line.pid && l.size === line.size && l.color === line.color
      );
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], qty: next[existingIdx].qty + qty };
        return next;
      }
      return [...prev, { ...line, qty }];
    });
  };

  const changeQty: CartContextValue["changeQty"] = (index, delta) => {
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], qty: next[index].qty + delta };
      return next.filter((l) => l.qty > 0);
    });
  };

  const removeLine: CartContextValue["removeLine"] = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, l) => sum + l.price * l.qty, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        changeQty,
        removeLine,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}