from rest_framework import serializers

from orders.models import Order
from .models import CustomerPayment, PaymentStatus
from .mpesa import MpesaService


def normalize_phone_number(phone):
    phone = phone.strip().replace(" ", "").replace("-", "")

    if phone.startswith("+254"):
        phone = phone[1:]

    elif phone.startswith("0"):
        phone = "254" + phone[1:]

    if not phone.startswith("254"):
        raise serializers.ValidationError(
            {"phone_number": "Enter a valid Kenyan phone number."}
        )

    if len(phone) != 12 or not phone.isdigit():
        raise serializers.ValidationError(
            {"phone_number": "Enter a valid Kenyan phone number."}
        )

    if phone[3] not in "71":
        raise serializers.ValidationError(
            {"phone_number": "Enter a valid Kenyan mobile number."}
        )

    return phone


class StkPushSerializer(serializers.Serializer):
    order_number = serializers.CharField()
    phone_number = serializers.CharField(max_length=15)

    def create(self, validated_data):
        order_number = validated_data["order_number"]
        phone_number = normalize_phone_number(validated_data["phone_number"])

        order = Order.objects.filter(order_number=order_number).first()

        if not order:
            raise serializers.ValidationError(
                {"order_number": "Order not found."}
            )

        if order.total_amount <= 0:
            raise serializers.ValidationError(
                {"order_number": "Order amount must be greater than zero."}
            )
        if order.status == Order.Status.PAID:
            raise serializers.ValidationError(
                {"order_number": "Has been paid"}
            )

        mpesa = MpesaService()

        response = mpesa.stk_push(
            amount=order.total_amount,
            phone_number=phone_number,
            account_reference=order.order_number,
            transaction_description=f"Payment for {order.order_number}",
        )

        customer_payment = CustomerPayment.objects.create(
            account_reference=order.order_number,
            amount=order.total_amount,
            party_a=phone_number,
            checkout_request_id=response["CheckoutRequestID"],
        )

        return {
            "order": order,
            "customer_payment": customer_payment,
            "mpesa_response": response,
        }


class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentStatus
        fields = "__all__"