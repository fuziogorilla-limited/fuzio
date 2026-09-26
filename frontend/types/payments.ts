// What we send to POST /api/payments/stk-push/
export type StkPushInput = {
    order_number: string;
    phone_number: string;
};

// Safaricom's raw STK push acknowledgement — this only confirms the prompt
// was sent to the phone, not that payment succeeded.
export type MpesaStkPushRawResponse = {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
};

export type StkPushResponse = {
    message: string;
    mpesa_response: MpesaStkPushRawResponse;
};

// Local state machine for the pay-with-M-Pesa flow. There is no dedicated
// "check payment status" endpoint — the real outcome only lands via
// Safaricom's server-to-server callback, which flips the Order's status.
// We find out by polling GET /api/orders/orders/:order_number/ until it
// changes away from "pending_payment".
export type PaymentFlowStatus =
    | "idle"
    | "pushing"
    | "awaiting_pin"
    | "success"
    | "timeout"
    | "failed";