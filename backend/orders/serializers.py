from rest_framework import serializers
from django.db import transaction
from inventory.models import Product
from .models import Cart, CartItem, Order, OrderItem
from django.utils import timezone
from inventory.models import ProductVariant
from django.db import transaction


class CreateCartItemSerializer(serializers.Serializer):
    variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.filter(
            is_active=True,
            product__is_active=True,
        )
    )

    quantity = serializers.IntegerField(
        min_value=1,
    )

    def validate(self, attrs):
        variant = attrs["variant"]

        if variant.quantity < attrs["quantity"]:
            raise serializers.ValidationError({
                "quantity": (
                    f"Only {variant.quantity} items "
                    "are currently available."
                )
            })

        return attrs

    def create(self, validated_data):
        cart = self.context["cart"]

        variant = validated_data["variant"]
        quantity = validated_data["quantity"]

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={
                "quantity": quantity,
                "price": variant.product.selling_price,
            },
        )

        if not created:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > variant.quantity:
                raise serializers.ValidationError({
                    "quantity": (
                        f"Only {variant.quantity} items "
                        "are currently available."
                    )
                })

            cart_item.quantity = new_quantity
            cart_item.save(
                update_fields=["quantity"]
            )

        return cart_item


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product_name",
            "color",
            "size",
            "quantity",
            "price",
            "total_price",
        ]

        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "order_number",
            "public_token",
            "first_name",
            "last_name",
            "phone_number",
            "email",
            "county",
            "town",
            "address",
            "additional_information",
            "status",
            "total_amount",
            "created_at",
            "updated_at",
            "items",
        ]

        read_only_fields = fields


class CreateOrderItemSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):

    cart_id = serializers.UUIDField()

    first_name = serializers.CharField(
        max_length=100
    )

    last_name = serializers.CharField(
        max_length=100
    )

    phone_number = serializers.CharField(
        max_length=20
    )

    email = serializers.EmailField(
        required=False,
        allow_blank=True,
    )

    county = serializers.CharField(
        max_length=100
    )

    town = serializers.CharField(
        max_length=100
    )

    address = serializers.CharField(
        max_length=255
    )

    additional_information = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )

    def validate(self, attrs):
        try:
            cart = Cart.objects.prefetch_related(
                "items__variant__product"
            ).get(
                cart_id=attrs["cart_id"]
            )
        except Cart.DoesNotExist:
            raise serializers.ValidationError({
                "cart_id": "Cart does not exist."
            })

        if cart.is_checked_out:
            raise serializers.ValidationError({
                "cart_id": "This cart has already been checked out."
            })

        if not cart.items.exists():
            raise serializers.ValidationError({
                "cart_id": "Cart is empty."
            })

        # Validate stock WITHOUT subtracting it.
        for item in cart.items.select_related(
            "variant",
            "variant__product",
        ):

            variant = item.variant

            if not variant.is_active:
                raise serializers.ValidationError({
                    "cart_id": (
                        f"{variant.product.name} "
                        f"({variant.color}/{variant.size}) "
                        "is no longer available."
                    )
                })

            if not variant.product.is_active:
                raise serializers.ValidationError({
                    "cart_id": (
                        f"{variant.product.name} "
                        "is no longer available."
                    )
                })

            if item.quantity > variant.quantity:
                raise serializers.ValidationError({
                    "cart_id": (
                        f"Only {variant.quantity} units of "
                        f"{variant.product.name} "
                        f"({variant.color}/{variant.size}) "
                        "are available."
                    )
                })

        attrs["cart"] = cart

        return attrs

    @transaction.atomic
    def create(self, validated_data):

        cart = validated_data.pop("cart")
        validated_data.pop("cart_id")

        items = list(
            cart.items.select_related(
                "variant",
                "variant__product",
            )
        )

        order = Order.objects.create(
            **validated_data,
            status=Order.Status.PENDING_PAYMENT,
        )

        total = 0

        order_items = []

        for cart_item in items:

            variant = cart_item.variant
            product = variant.product

            price = product.selling_price

            order_items.append(
                OrderItem(
                    order=order,
                    variant=variant,
                    quantity=cart_item.quantity,
                    price=price,
                    product_name=product.name,
                    color=variant.color,
                    size=variant.size,
                )
            )

            total += price * cart_item.quantity

        OrderItem.objects.bulk_create(order_items)

        order.total_amount = total
        order.save(
            update_fields=["total_amount"]
        )

        cart.is_checked_out = True
        cart.checked_out_at = timezone.now()
        cart.save(
            update_fields=[
                "is_checked_out",
                "checked_out_at",
            ]
        )

        return order


class ListOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields="__all__"

class OrderUpdate(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)

    def update(self, instance, validated_data):
        instance.status = validated_data["status"]
        instance.save(update_fields=["status"])
        return instance