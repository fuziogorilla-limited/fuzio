import logging

from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .models import CustomerPayment, PaymentStatus
from .serializers import (
    StkPushSerializer,
    PaymentStatusSerializer,
)
from orders.models import Order
from inventory.models import ProductVariant

logger = logging.getLogger(__name__)


class StkPushApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = StkPushSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = serializer.save()

        return Response(
            {
                "message": "STK Push sent successfully.",
                "mpesa_response": result["mpesa_response"],
            },
            status=status.HTTP_200_OK,
        )


class PaymentStatusApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data

        stk_callback = data.get("Body", {}).get("stkCallback", {})

        if not stk_callback:
            return Response(
                {"error": "Invalid M-Pesa callback."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        merchant_request_id = stk_callback.get("MerchantRequestID")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        result_code = stk_callback.get("ResultCode")
        result_description = stk_callback.get("ResultDesc")

        if not checkout_request_id:
            return Response(
                {"error": "CheckoutRequestID is missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if result_code is None:
            return Response(
                {"error": "ResultCode is missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Safaricom doesn't always send this as the same type across
        # sandbox/production — normalize before comparing.
        try:
            result_code = int(result_code)
        except (TypeError, ValueError):
            return Response(
                {"error": "ResultCode is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            customer_payment = CustomerPayment.objects.get(
                checkout_request_id=checkout_request_id
            )
        except CustomerPayment.DoesNotExist:
            return Response(
                {"error": "Payment record not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Populated if something stops us from safely deducting stock.
        # We still ack the callback with 200 (so M-Pesa stops retrying)
        # but surface this so it can be reconciled manually.
        stock_error = None

        with transaction.atomic():

            payment_status, created = PaymentStatus.objects.update_or_create(
                checkout_request_id=checkout_request_id,
                defaults={
                    "customer": customer_payment,
                    "merchant_request_id": merchant_request_id,
                    "response_code": str(result_code),
                    "response_description": result_description,
                },
            )

            # Payment successful
            if result_code == 0:

                # Idempotency: if a redelivered webhook comes in after we've
                # already marked this SUCCESS, don't reprocess it.
                if customer_payment.status != "SUCCESS":
                    customer_payment.status = "SUCCESS"

                    callback_metadata = stk_callback.get(
                        "CallbackMetadata", {}
                    )
                    items = callback_metadata.get("Item", [])

                    for item in items:
                        if item.get("Name") == "MpesaReceiptNumber":
                            customer_payment.mpesa_receipt_number = item.get(
                                "Value"
                            )
                            break

                    customer_payment.save(
                        update_fields=[
                            "status",
                            "mpesa_receipt_number",
                        ]
                    )

                order = (
                    Order.objects.select_for_update()
                    .filter(order_number=customer_payment.account_reference)
                    .first()
                )

                if order is None:
                    stock_error = "Order not found for this payment."
                    logger.error(
                        "M-Pesa payment succeeded for %s but no matching "
                        "order was found.",
                        customer_payment.account_reference,
                    )

                elif order.status != Order.Status.PAID:

                    order_items = list(order.items.all())

                    # Lock the specific variant rows we're about to touch,
                    # so a concurrent checkout/payment can't read stale
                    # quantity and oversell the same units.
                    variant_ids = [oi.variant_id for oi in order_items]
                    variants = {
                        v.id: v
                        for v in ProductVariant.objects.select_for_update().filter(
                            id__in=variant_ids
                        )
                    }

                    # Validate every line first — never deduct part of an
                    # order and leave the rest short.
                    for order_item in order_items:
                        variant = variants[order_item.variant_id]
                        if variant.quantity < order_item.quantity:
                            stock_error = (
                                f"Not enough stock for {order_item.product_name} "
                                f"({order_item.color}/{order_item.size})."
                            )
                            break

                    if stock_error is None:
                        for order_item in order_items:
                            variant = variants[order_item.variant_id]
                            variant.quantity -= order_item.quantity
                            variant.save(update_fields=["quantity"])

                        order.status = Order.Status.PAID
                        order.save(update_fields=["status"])
                    else:
                        logger.error(
                            "Stock deduction failed for order %s: %s",
                            order.order_number,
                            stock_error,
                        )

            # Payment failed
            else:
                customer_payment.status = "FAILED"

                customer_payment.save(
                    update_fields=["status"]
                )

        response_payload = {
            "message": "Callback received.",
            "payment_status": PaymentStatusSerializer(
                payment_status
            ).data,
        }

        if stock_error:
            response_payload["warning"] = stock_error

        return Response(response_payload, status=status.HTTP_200_OK)