"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

const WHATSAPP_NUMBER = "254700000000";
const DELIVERY_FEE = 300; // keep in sync with CartDrawer

function fmt(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

type OrderItemResponse = {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
};

type OrderResponse = {
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

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  address: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  county: "",
  town: "",
  address: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponse | null>(null);

  const delivery = cart.length ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  // Bounce to home if someone lands here with an empty cart (and no order just placed)
  useEffect(() => {
    if (cart.length === 0 && !confirmedOrder) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length, confirmedOrder]);

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.address.trim() || !form.county.trim() || !form.town.trim()) {
      setError("Please fill in your name, phone, county, town and delivery address.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim() || null,
        county: form.county.trim(),
        town: form.town.trim(),
        address: form.address.trim(),
        additional_information: form.notes.trim() || null,
        items: cart.map((l) => ({
          product: Number(l.pid),
          quantity: l.qty,
        })),
      };

      const res = await apiFetch<{ message: string; order: OrderResponse }>(routes.orders.create, {
        method: "POST",
        body: payload,
      });

      setConfirmedOrder(res.order);
      clearCart();
    } catch (err) {
      console.error(err);
      setError("Something went wrong placing your order. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const waConfirmOrder = () => {
    if (!confirmedOrder) return;
    let msg = `Hello Fuzio Gorilla,\n\nI would like to place an order.\n\nOrder Number:\n${confirmedOrder.order_number}\n\nProducts:\n`;
    confirmedOrder.items.forEach((it) => {
      msg += `- ${it.product_name} x${it.quantity} — ${fmt(Number(it.price) * it.quantity)}\n`;
    });
    msg += `\nTotal:\n${fmt(total)}\n\nDelivery Location:\n${confirmedOrder.address}, ${confirmedOrder.town}, ${confirmedOrder.county}\n\nName: ${confirmedOrder.first_name} ${confirmedOrder.last_name}\nPhone: ${confirmedOrder.phone_number}\n\nPlease confirm my order and delivery details.`;
    window.open(waLink(msg), "_blank");
  };

  // ---------- Confirmation screen ----------
  if (confirmedOrder) {
    return (
      <main className="w-full overflow-x-hidden bg-bg px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[520px] text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green text-3xl text-white">
            ✓
          </div>
          <h1 className="mb-2.5 text-2xl font-black">Order Received</h1>
          <p className="mb-1 text-sm text-steel">Thank you for choosing Fuzio Gorilla.</p>
          <p className="mb-3 text-sm text-steel">Your order number is:</p>
          <div className="mb-7 font-mono text-xl font-bold tracking-wide text-accent-dark">
            {confirmedOrder.order_number}
          </div>
          <div className="mx-auto flex max-w-[320px] flex-col gap-2.5">
            <button
              onClick={() => alert("Payment gateway placeholder — integrate M-Pesa / card here")}
              className="w-full border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
            >
              Pay Now
            </button>
            <button
              onClick={waConfirmOrder}
              className="flex w-full items-center justify-center gap-2 bg-green py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
            >
              <FaWhatsapp /> Confirm on WhatsApp
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border-2 border-ink py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ---------- Checkout form ----------
  return (
    <main className="w-full overflow-x-hidden bg-bg">
      <div className="bg-ink px-4 py-6 text-paper sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Checkout
          </div>
          <h1 className="mt-2 text-2xl font-black sm:text-[26px]">Delivery &amp; Contact Details</h1>
        </div>
      </div>

      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <div>
            <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="First Name">
                <input
                  value={form.firstName}
                  onChange={setField("firstName")}
                  type="text"
                  placeholder="Jane"
                  className="input"
                />
              </Field>
              <Field label="Last Name">
                <input
                  value={form.lastName}
                  onChange={setField("lastName")}
                  type="text"
                  placeholder="Wanjiru"
                  className="input"
                />
              </Field>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Phone Number">
                <input
                  value={form.phone}
                  onChange={setField("phone")}
                  type="tel"
                  placeholder="07XX XXX XXX"
                  className="input"
                />
              </Field>
              <Field label="Email Address (optional)">
                <input
                  value={form.email}
                  onChange={setField("email")}
                  type="email"
                  placeholder="jane@example.com"
                  className="input"
                />
              </Field>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="County">
                <input
                  value={form.county}
                  onChange={setField("county")}
                  type="text"
                  placeholder="Nairobi"
                  className="input"
                />
              </Field>
              <Field label="Town / City">
                <input
                  value={form.town}
                  onChange={setField("town")}
                  type="text"
                  placeholder="Industrial Area"
                  className="input"
                />
              </Field>
            </div>

            <Field label="Delivery Address">
              <input
                value={form.address}
                onChange={setField("address")}
                type="text"
                placeholder="Street, building, landmark"
                className="input"
              />
            </Field>

            <Field label="Additional Order Notes (optional)">
              <textarea
                value={form.notes}
                onChange={setField("notes")}
                rows={3}
                placeholder="Any special instructions"
                className="input resize-none"
              />
            </Field>

            {error && (
              <p className="mt-2 border border-accent-dark/30 bg-accent/10 px-3.5 py-2.5 text-[13px] font-semibold text-accent-dark">
                {error}
              </p>
            )}
          </div>

          {/* Order summary */}
          <div className="border border-ink/10 bg-paper p-5">
            <h3 className="mb-4 text-[15px] font-extrabold">Order Summary</h3>

            {cart.map((l, idx) => {
              const meta = [l.size, l.color].filter(Boolean).join(" · ") || "Standard";
              return (
                <div key={`${l.pid}-${idx}`} className="flex justify-between border-b border-ink/5 py-2 text-[12.5px]">
                  <div>
                    <span className="font-semibold">
                      {l.name} × {l.qty}
                    </span>
                    <span className="block text-[11px] text-steel">{meta}</span>
                  </div>
                  <span className="font-mono">{fmt(l.price * l.qty)}</span>
                </div>
              );
            })}

            <div className="mt-3.5 flex justify-between text-[13px] text-steel">
              <span>Subtotal</span>
              <span className="font-mono">{fmt(subtotal)}</span>
            </div>
            <div className="mb-2.5 flex justify-between text-[13px] text-steel">
              <span>Delivery</span>
              <span className="font-mono">{fmt(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2.5 font-mono text-base font-extrabold">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4.5 w-full border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
            <p className="mt-2.5 text-center text-[11px] text-steel">Guest checkout — no account needed.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}