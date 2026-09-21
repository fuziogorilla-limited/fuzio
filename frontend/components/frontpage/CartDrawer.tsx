"use client";

import Link from "next/link";
import {
  FaTimes,
  FaWhatsapp,
  FaBoxOpen,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { DELIVERY_FEE } from "@/constants/shared";
import { formatPrice, waLink } from "@/lib/utils";

export default function CartDrawer() {
  const {
    cart,
    subtotal,
    isCartOpen,
    closeCart,
    changeQty,
    removeLine,
  } = useCart();

  const delivery = cart.length ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const waFromCart = () => {
    if (!cart.length) return;

    let message = "Hello Fuzio Gorilla,\n\nI would like to place an order.\n\nProducts:\n";

    cart.forEach((line) => {
      const options = [line.size, line.color]
        .filter(Boolean)
        .join(", ");

      message += `- ${line.name}${
        options ? ` (${options})` : ""
      } x${line.qty} — ${formatPrice(line.price * line.qty)}\n`;
    });

    message += `\nTotal:\n${formatPrice(
      total
    )}\n\nPlease confirm my order and delivery details.`;

    window.open(waLink(message), "_blank");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-ink/50 transition-opacity duration-200 ${
          isCartOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
        className={`fixed right-0 top-0 z-[95] flex h-full w-[420px] max-w-[92vw] flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          isCartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h3 className="text-base font-extrabold">
            Your Cart
          </h3>

          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="text-steel transition-colors hover:text-ink"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-sm text-steel">
              Your cart is empty.
              <br />
              Browse categories to get started.
            </div>
          ) : (
            cart.map((line, index) => {
              const meta =
                [line.size, line.color]
                  .filter(Boolean)
                  .join(" · ") || "Standard";

              return (
                <div
                  key={`${line.pid}-${line.size}-${line.color}`}
                  className="flex gap-3 border-b border-ink/5 py-3.5 last:border-none"
                >
                  {/* Product icon */}
                  <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center bg-ink-2 text-2xl">
                    {line.icon ?? (
                      <FaBoxOpen
                        className="text-steel-light"
                        size={20}
                      />
                    )}
                  </div>

                  {/* Product details */}
                  <div className="min-w-0 flex-1">
                    <h6 className="mb-0.5 line-clamp-2 text-[13px] font-bold leading-snug">
                      {line.name}
                    </h6>

                    <div className="mb-2 text-[11px] text-steel">
                      {meta}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-ink/15">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() =>
                            changeQty(index, -1)
                          }
                          className="flex h-6 w-6 items-center justify-center text-[11px] hover:bg-bg"
                        >
                          <FaMinus size={8} />
                        </button>

                        <span className="w-[26px] text-center font-mono text-xs font-bold">
                          {line.qty}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${line.name}`}
                          onClick={() =>
                            changeQty(index, 1)
                          }
                          className="flex h-6 w-6 items-center justify-center text-[11px] hover:bg-bg"
                        >
                          <FaPlus size={8} />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="font-mono text-[13px] font-bold">
                        {formatPrice(
                          line.price * line.qty
                        )}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="mt-1.5 text-[11px] font-semibold text-steel underline transition-colors hover:text-accent-dark"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-ink/10 px-5 pb-5 pt-4">
            {/* Subtotal */}
            <div className="mb-2 flex justify-between text-[13px] text-steel">
              <span>Subtotal</span>

              <span className="font-mono">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Delivery */}
            <div className="mb-2 flex justify-between text-[13px] text-steel">
              <span>Delivery</span>

              <span className="font-mono">
                {formatPrice(delivery)}
              </span>
            </div>

            {/* Total */}
            <div className="mt-2.5 flex justify-between border-t border-ink/10 pt-2.5 font-mono text-base font-extrabold">
              <span>Total</span>

              <span>{formatPrice(total)}</span>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 block w-full border-2 border-ink bg-ink py-3 text-center text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
            >
              Proceed to Checkout
            </Link>

            {/* WhatsApp order */}
            <button
              type="button"
              onClick={waFromCart}
              className="mt-2.5 flex w-full items-center justify-center gap-2 bg-green py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
            >
              <FaWhatsapp />
              Order on WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}