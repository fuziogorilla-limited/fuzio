from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart,Order
from .serializers import (
    CreateCartItemSerializer,
    CreateOrderSerializer,
    OrderSerializer,
    ListOrdersSerializer,
    OrderUpdate,
)


# Create the initial guest cart
class CreateCartApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = Cart.objects.create()

        return Response(
            {
                "message": "Cart created successfully",
                "cart_id": cart.cart_id,
            },
            status=status.HTTP_201_CREATED,
        )


# Add an item to an existing guest cart
class CartItemApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, cart_id):
        cart = get_object_or_404(Cart, cart_id=cart_id)
        serializer = CreateCartItemSerializer(data=request.data, context={"cart": cart})
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response(
            {
                "message": "Item added to cart",
                "item": {
                    "product": item.product.id,
                    "quantity": item.quantity,
                    "price": item.price,
                    "total_price": item.total_price(),
                },
            },
            status=status.HTTP_201_CREATED,
        )


# View the contents of an existing guest cart
class CartDetailApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, cart_id):
        cart = get_object_or_404(Cart, cart_id=cart_id)
        items = cart.items.all()
        return Response(
            {
                "cart_id": cart.cart_id,
                "items": [
                    {
                        "product": item.product.id,
                        "product_name": item.product.name,
                        "quantity": item.quantity,
                        "price": item.price,
                        "total_price": item.total_price(),
                    }
                    for item in items
                ],
            },
            status=status.HTTP_200_OK,
        )


# Create an order
class OrderApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(
            {
                "message": "Order created successfully",
                "order": OrderSerializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )


# Get a single order
class OrderDetailApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, order_number):
        order = get_object_or_404(
            Order,
            order_number=order_number,
        )
        serializer = OrderSerializer(order)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

#get all orders (admin)
class OrderListApiView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        orders=Order.objects.all()
        serializer=ListOrdersSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateOrderStatusApiView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def patch(self, request, pk):
        order=get_object_or_404(Order, pk=pk)
        serializer=OrderUpdate(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"Order marked successfully",
        }, status=status.HTTP_200_OK)