from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import CartItem, Order
from rest_framework import serializers
from inventory.models import Product

class CreateCartItemSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True)
    )
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
    
class OrderSerializer(ModelSerializer):
    class Meta:
        model=Order
        fields="__all__"

class CreateOrderSerializer(ModelSerializer):
    class Meta:
        model=Order
        exclude=[
            "id",
            "order_number",
            "created_at",
        ]
