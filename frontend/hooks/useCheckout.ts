"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DELIVERY_FEE } from "@/constants/shared";
import { useCart } from "@/context/CartContext";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import { formatPrice, waLink } from "@/lib/utils";

import type {
  CheckoutFormData,
  OrderResponse,
} from "@/types/fields";

const CHECKOUT = {
  emptyCartMessage: "Your cart is empty.",
  validationMessage:
    "Please fill in your name, phone, county, town and delivery address.",
  submitError:
    "Something went wrong placing your order. Please check your details and try again.",
} as const;

const EMPTY_FORM: CheckoutFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  county: "",
  town: "",
  address: "",
  notes: "",
};

export function useCheckout() {
  const router = useRouter();

  const {
    cart,
    subtotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState<CheckoutFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] =
    useState<OrderResponse | null>(null);

  const delivery = cart.length ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  useEffect(() => {
    if (cart.length === 0 && !confirmedOrder) {
      router.replace("/");
    }
  }, [cart.length, confirmedOrder, router]);

  const setField =
    (key: keyof CheckoutFormData) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    setError(null);

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.county.trim() ||
      !form.town.trim()
    ) {
      setError(CHECKOUT.validationMessage);
      return;
    }

    if (cart.length === 0) {
      setError(CHECKOUT.emptyCartMessage);
      return;
    }

    setSubmitting(true);

    try {
      const cartResponse = await apiFetch<{ cart_id: string }>(
        routes.cart.create,
        { method: "POST", body: {} }
      );

      for (const line of cart) {
        await apiFetch(routes.cart.items(cartResponse.cart_id), {
          method: "POST",
          body: {
            variant: Number(line.pid),
            quantity: line.qty,
          },
        });
      }

      const payload = {
        cart_id: cartResponse.cart_id,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim() || "",
        county: form.county.trim(),
        town: form.town.trim(),
        address: form.address.trim(),
        additional_information: form.notes.trim() || "",
      };

      const response = await apiFetch<{
        message: string;
        order: OrderResponse;
      }>(routes.orders.create, {
        method: "POST",
        body: payload,
      });

      setConfirmedOrder(response.order);
      clearCart();
    } catch (err) {
      console.error(err);

      setError(CHECKOUT.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const waConfirmOrder = () => {
    if (!confirmedOrder) {
      return;
    }

    let message =
      `Hello Fuzio Gorilla,\n\n` +
      `I would like to place an order.\n\n` +
      `Order Number:\n${confirmedOrder.order_number}\n\n` +
      `Products:\n`;

    confirmedOrder.items.forEach((item) => {
      message +=
        `- ${item.product_name} x${item.quantity} — ` +
        `${formatPrice(
          Number(item.price) * item.quantity
        )}\n`;
    });

    message +=
      `\nTotal:\n${formatPrice(total)}` +
      `\n\nDelivery Location:\n` +
      `${confirmedOrder.address}, ` +
      `${confirmedOrder.town}, ` +
      `${confirmedOrder.county}` +
      `\n\nName: ${confirmedOrder.first_name} ${confirmedOrder.last_name}` +
      `\nPhone: ${confirmedOrder.phone_number}` +
      `\n\nPlease confirm my order and delivery details.`;

    window.open(waLink(message), "_blank");
  };

  return {
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

    continueShopping: () => router.push("/"),
    payNow: () =>
      alert(
        "Payment gateway placeholder — integrate M-Pesa / card here"
      ),
  };
}