from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .models import CustomerPayment, PaymentStatus
from .serializers import (
    StkPushSerializer,
    PaymentStatusSerializer,
)
from django.db import transaction
from django.shortcuts import get_object_or_404
from orders.models import Order


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

        try:
            customer_payment = CustomerPayment.objects.get(
                checkout_request_id=checkout_request_id
            )
        except CustomerPayment.DoesNotExist:
            return Response(
                {"error": "Payment record not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

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

                customer_payment.status = "SUCCESS"

                # Get M-Pesa receipt
                callback_metadata = stk_callback.get(
                    "CallbackMetadata",
                    {}
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

                # Get the order
                order = Order.objects.select_for_update().get(
                    order_number=customer_payment.account_reference
                )

                # Only deduct stock if order has not already been paid
                if order.status != Order.Status.PAID:

                    for order_item in order.items.select_related(
                        "variant"
                    ):

                        variant = order_item.variant

                        # Make sure there is enough stock
                        if variant.quantity < order_item.quantity:
                            raise ValueError(
                                f"Not enough stock for "
                                f"{order_item.product_name}."
                            )

                        variant.quantity -= order_item.quantity

                        variant.save(
                            update_fields=["quantity"]
                        )

                    # Mark order as paid
                    order.status = Order.Status.PAID

                    order.save(
                        update_fields=["status"]
                    )

            # Payment failed
            else:
                customer_payment.status = "FAILED"

                customer_payment.save(
                    update_fields=["status"]
                )

        return Response(
            {
                "message": "Callback received.",
                "payment_status": PaymentStatusSerializer(
                    payment_status
                ).data,
            },
            status=status.HTTP_200_OK,
        )