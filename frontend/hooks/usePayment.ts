import { useCallback, useRef, useState } from "react";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import type { OrderPayload } from "@/types/orders";
import type {
    PaymentFlowStatus,
    StkPushInput,
    StkPushResponse,
} from "@/types/payments";

type ApiError = {
    status: number;
    data: Record<string, unknown> | null;
};

// How often to re-check the order, and how long to keep trying before we
// tell the user we've lost track of it. An M-Pesa STK prompt itself expires
// after ~60s on the phone, so 90s of polling gives a little headroom.
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90_000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractErrorMessage(err: unknown, fallback: string): string {
    if (err && typeof err === "object" && "data" in err) {
        const apiErr = err as ApiError;
        const data = apiErr.data;

        if (data && typeof data === "object") {
            if (typeof (data as { error?: unknown }).error === "string") {
                return (data as { error: string }).error;
            }

            const firstValue = Object.values(data)[0];

            if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
                return firstValue[0];
            }

            if (typeof firstValue === "string") {
                return firstValue;
            }
        }
    }

    return fallback;
}

export function usePayment() {
    const [status, setStatus] = useState<PaymentFlowStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    // Lets a component unmount (or the user navigate away) mid-poll without
    // the loop trying to setState afterwards.
    const cancelledRef = useRef(false);

    const reset = useCallback(() => {
        cancelledRef.current = false;
        setStatus("idle");
        setError(null);
    }, []);

    const cancel = useCallback(() => {
        cancelledRef.current = true;
    }, []);

    const pollOrderStatus = useCallback(
        async (orderNumber: string, token: string): Promise<OrderPayload> => {
            const startedAt = Date.now();

            while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
                if (cancelledRef.current) {
                    throw new Error("cancelled");
                }

                await sleep(POLL_INTERVAL_MS);

                if (cancelledRef.current) {
                    throw new Error("cancelled");
                }

                const order = await apiFetch<OrderPayload>(
                    routes.orders.orderDetail(orderNumber, token),
                    { skipAuth: true }
                );

                if (order.status === "paid") {
                    return order;
                }

                if (order.status === "cancelled") {
                    throw new Error("order_cancelled");
                }
            }

            throw new Error("timeout");
        },
        []
    );

    const pay = useCallback(
        async (
            orderNumber: string,
            token: string,
            phoneNumber: string
        ): Promise<OrderPayload | null> => {
            cancelledRef.current = false;
            setError(null);
            setStatus("pushing");

            try {
                await apiFetch<StkPushResponse>(routes.payments.stkPush, {
                    method: "POST",
                    body: {
                        order_number: orderNumber,
                        phone_number: phoneNumber,
                    } satisfies StkPushInput,
                    skipAuth: true,
                });
            } catch (err) {
                setError(
                    extractErrorMessage(
                        err,
                        "We couldn't start the M-Pesa payment. Check the number and try again."
                    )
                );
                setStatus("failed");
                return null;
            }

            setStatus("awaiting_pin");

            try {
                const order = await pollOrderStatus(orderNumber, token);
                setStatus("success");
                return order;
            } catch (err) {
                if (err instanceof Error && err.message === "cancelled") {
                    return null;
                }

                if (err instanceof Error && err.message === "order_cancelled") {
                    setError("This order was cancelled.");
                    setStatus("failed");
                    return null;
                }

                setError(
                    "We couldn't confirm your payment yet. If you completed the M-Pesa prompt, please contact us with your order number."
                );
                setStatus("timeout");
                return null;
            }
        },
        [pollOrderStatus]
    );

    return {
        pay,
        cancel,
        reset,
        status,
        error,
        submitting: status === "pushing" || status === "awaiting_pin",
    };
}