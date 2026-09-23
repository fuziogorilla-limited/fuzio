"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { DELIVERY_FEE } from "@/constants/shared";
import type { ID } from "@/types/inventory";

const STORAGE_KEY = "fuzio_cart_v1";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface CartItem {
    /** ProductVariant id — the actual unit being purchased. */
    variantId: ID;
    productId: ID;
    productName: string;
    /** Raw image path from the API (pass through mediaUrl() to render). */
    image: string | null;
    /** Unit selling price at the time it was added. */
    price: number;
    colorName: string;
    sizeName: string;
    sku: string;
    quantity: number;
}

export type AddToCartInput = Omit<CartItem, "quantity"> & {
    quantity?: number;
};

interface CartContextValue {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    total: number;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (input: AddToCartInput) => void;
    removeItem: (variantId: ID) => void;
    setQuantity: (variantId: ID, quantity: number) => void;
    incrementQuantity: (variantId: ID) => void;
    decrementQuantity: (variantId: ID) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/*  Storage helpers                                                           */
/* -------------------------------------------------------------------------- */

function readStoredCart(): CartItem[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
        return [];
    }
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Load whatever was persisted, once, after mount (avoids SSR mismatch).
    useEffect(() => {
        setItems(readStoredCart());
        setHydrated(true);
    }, []);

    // Persist on every change, but only after the initial load above has run
    // — otherwise this would immediately overwrite storage with `[]`.
    useEffect(() => {
        if (!hydrated) return;

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Storage unavailable (private browsing, quota exceeded, etc).
            // The cart still works for the rest of the session, it just
            // won't survive a reload.
        }
    }, [items, hydrated]);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

    const addItem = useCallback((input: AddToCartInput) => {
        const quantity = input.quantity ?? 1;

        setItems((prev) => {
            const existing = prev.find(
                (i) => i.variantId === input.variantId
            );

            if (existing) {
                return prev.map((i) =>
                    i.variantId === input.variantId
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }

            return [...prev, { ...input, quantity }];
        });

        setIsOpen(true);
    }, []);

    const removeItem = useCallback((variantId: ID) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    }, []);

    const setQuantity = useCallback((variantId: ID, quantity: number) => {
        setItems((prev) => {
            if (quantity <= 0) {
                return prev.filter((i) => i.variantId !== variantId);
            }

            return prev.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
            );
        });
    }, []);

    const incrementQuantity = useCallback((variantId: ID) => {
        setItems((prev) =>
            prev.map((i) =>
                i.variantId === variantId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            )
        );
    }, []);

    const decrementQuantity = useCallback((variantId: ID) => {
        setItems((prev) =>
            prev
                .map((i) =>
                    i.variantId === variantId
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    );

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [items]
    );

    const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    const value: CartContextValue = {
        items,
        isOpen,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        setQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);

    if (!ctx) {
        throw new Error("useCart must be used within a <CartProvider>");
    }

    return ctx;
}