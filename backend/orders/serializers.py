from rest_framework import serializers
from django.db import transaction
from inventory.models import Product
from .models import Cart, CartItem, Order, OrderItem


class CreateCartItemSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    quantity = serializers.IntegerField(min_value=1)

    def create(self, validated_data):
        cart = self.context["cart"]
        product = validated_data["product"]

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": validated_data["quantity"],
                "price": product.selling_price,
            },
        )

        if not created:
            cart_item.quantity += validated_data["quantity"]
            cart_item.save(update_fields=["quantity"])
        return cart_item


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price"]
        read_only_fields = ["price"]


class CreateOrderItemSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"


class CreateOrderSerializer(serializers.ModelSerializer):
    items = CreateOrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        exclude = ["order_number", "created_at", "is_delivered"]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            OrderItem.objects.bulk_create(
                [
                    OrderItem(
                        order=order,
                        product=item["product"],
                        quantity=item["quantity"],
                        price=item["product"].selling_price,  # server-side price, never client-supplied
                    )
                    for item in items_data
                ]
            )

        return order


class ListOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields="__all__"

class OrderUpdate(serializers.Serializer):
    is_delivered=serializers.BooleanField()

    def update(self, instance, validated_data):
        instance.is_delivered=validated_data["is_delivered"]
        instance.save(update_fields=["is_delivered"])
        return instance