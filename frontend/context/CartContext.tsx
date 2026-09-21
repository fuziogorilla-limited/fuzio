"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AddToCartInput, CartLine } from "@/types/fields";

type CartContextValue = {
  cart: CartLine[];

  cartCount: number;

  subtotal: number;

  isCartOpen: boolean;

  openCart: () => void;

  closeCart: () => void;

  addToCart: (line: AddToCartInput) => void;

  changeQty: (index: number, delta: number) => void;

  removeLine: (index: number) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (line: AddToCartInput) => {
    const qty = line.qty ?? 1;

    setCart((previousCart) => {
      const existingIndex = previousCart.findIndex(
        (item) =>
          item.pid === line.pid &&
          item.size === line.size &&
          item.color === line.color
      );

      if (existingIndex !== -1) {
        const nextCart = [...previousCart];

        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          qty: nextCart[existingIndex].qty + qty,
        };

        return nextCart;
      }

      return [
        ...previousCart,
        {
          ...line,
          qty,
        },
      ];
    });
  };

  const changeQty = (index: number, delta: number) => {
    setCart((previousCart) => {
      const nextCart = [...previousCart];

      if (!nextCart[index]) {
        return previousCart;
      }

      nextCart[index] = {
        ...nextCart[index],
        qty: nextCart[index].qty + delta,
      };

      return nextCart.filter((item) => item.qty > 0);
    });
  };

  const removeLine = (index: number) => {
    setCart((previousCart) =>
      previousCart.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.qty,
        0
      ),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      ),
    [cart]
  );

  const value = useMemo<CartContextValue>(
    () => ({
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
    }),
    [
      cart,
      cartCount,
      subtotal,
      isCartOpen,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}