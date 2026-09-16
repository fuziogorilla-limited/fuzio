"use client";

import { FaWhatsapp } from "react-icons/fa";

import { CHECKOUT } from "@/constants/checkout";
import { useCheckout } from "@/hooks/useCheckout";
import { formatPrice } from "@/lib/utils";

const FIELD_CLASSES =
  "w-full border-[1.5px] border-ink/15 bg-paper px-3.5 py-3 text-[13.5px] text-ink outline-none transition-colors placeholder:text-steel-light focus:border-ink";

export default function Checkout() {
  const {
    cart,
    subtotal,
    delivery,
    total,

    form,
    submitting,
    error,
    confirmedOrder,

    setField,
    handleSubmit,
    waConfirmOrder,

    continueShopping,
    payNow,
  } = useCheckout();

  // --------------------------------------------------
  // Confirmation screen
  // --------------------------------------------------

  if (confirmedOrder) {
    return (
      <main className="w-full overflow-x-hidden bg-bg px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[520px] text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green text-3xl text-white">
            ✓
          </div>

          <h1 className="mb-2.5 text-2xl font-black">
            Order Received
          </h1>

          <p className="mb-1 text-sm text-steel">
            Thank you for choosing Fuzio Gorilla.
          </p>

          <p className="mb-3 text-sm text-steel">
            Your order number is:
          </p>

          <div className="mb-7 font-mono text-xl font-bold tracking-wide text-accent-dark">
            {confirmedOrder.order_number}
          </div>

          <div className="mx-auto flex max-w-[320px] flex-col gap-2.5">
            <button
              type="button"
              onClick={payNow}
              className="w-full border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
            >
              Pay Now
            </button>

            <button
              type="button"
              onClick={waConfirmOrder}
              className="flex w-full items-center justify-center gap-2 bg-green py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
            >
              <FaWhatsapp />
              Confirm on WhatsApp
            </button>

            <button
              type="button"
              onClick={continueShopping}
              className="w-full border-2 border-ink py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Checkout page
  // --------------------------------------------------

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      {/* Page header */}
      <div className="bg-ink px-4 py-6 text-paper sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            {CHECKOUT.pageLabel}
          </div>

          <h1 className="mt-2 text-2xl font-black sm:text-[26px]">
            {CHECKOUT.title}
          </h1>
        </div>
      </div>

      {/* Checkout content */}
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Delivery form */}
          <div>
            <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="mb-4">
                <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                  First Name
                </label>

                <input
                  value={form.firstName}
                  onChange={setField("firstName")}
                  type="text"
                  placeholder="Jane"
                  className={FIELD_CLASSES}
                />
              </div>

              <div className="mb-4">
                <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                  Last Name
                </label>

                <input
                  value={form.lastName}
                  onChange={setField("lastName")}
                  type="text"
                  placeholder="Wanjiru"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="mb-4">
                <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                  Phone Number
                </label>

                <input
                  value={form.phone}
                  onChange={setField("phone")}
                  type="tel"
                  placeholder="07XX XXX XXX"
                  className={FIELD_CLASSES}
                />
              </div>

              <div className="mb-4">
                <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                  Email Address (optional)
                </label>

                <input
                  value={form.email}
                  onChange={setField("email")}
                  type="email"
                  placeholder="jane@example.com"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="mb-4">
                <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                  County
                </label>

                <input
                  value={form.county}
                  onChange={setField("county")}
                  type="text"
                  placeholder="Nairobi"
                  className={FIELD_CLASSES}
                />
              </div>

              <div className="mb-4">
                <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                  Town / City
                </label>

                <input
                  value={form.town}
                  onChange={setField("town")}
                  type="text"
                  placeholder="Industrial Area"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                Delivery Address
              </label>

              <input
                value={form.address}
                onChange={setField("address")}
                type="text"
                placeholder="Street, building, landmark"
                className={FIELD_CLASSES}
              />
            </div>

            <div className="mb-4">
              <label className="mb-[7px] block text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink">
                Additional Order Notes (optional)
              </label>

              <textarea
                value={form.notes}
                onChange={setField("notes")}
                rows={3}
                placeholder="Any special instructions"
                className={`${FIELD_CLASSES} resize-none`}
              />
            </div>

            {error && (
              <p className="mt-2 border border-accent-dark/30 bg-accent/10 px-3.5 py-2.5 text-[13px] font-semibold text-accent-dark">
                {error}
              </p>
            )}
          </div>

          {/* Order summary */}
          <div className="border border-ink/10 bg-paper p-[22px]">
            <h3 className="mb-4 text-[15px] font-extrabold">
              Order Summary
            </h3>

            {cart.map((line, index) => {
              const meta =
                [line.size, line.color]
                  .filter(Boolean)
                  .join(" · ") || "Standard";

              return (
                <div
                  key={`${line.pid}-${index}`}
                  className="flex justify-between border-b border-ink/5 py-2 text-[12.5px]"
                >
                  <div>
                    <span className="font-semibold text-ink">
                      {line.name} × {line.qty}
                    </span>

                    <span className="block text-[11px] text-steel">
                      {meta}
                    </span>
                  </div>

                  <span className="font-mono">
                    {formatPrice(line.price * line.qty)}
                  </span>
                </div>
              );
            })}

            <div className="mt-3.5 flex justify-between text-[13px] text-steel">
              <span>Subtotal</span>

              <span className="font-mono">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="mb-2.5 flex justify-between text-[13px] text-steel">
              <span>Delivery</span>

              <span className="font-mono">
                {formatPrice(delivery)}
              </span>
            </div>

            <div className="flex justify-between border-t border-ink/10 pt-2.5 font-mono text-base font-extrabold">
              <span>Total</span>

              <span>{formatPrice(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-[18px] w-full border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Placing Order…"
                : "Place Order"}
            </button>

            <p className="mt-2.5 text-center text-[11px] text-steel">
              Guest checkout — no account needed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}