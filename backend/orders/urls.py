from django.urls import path

from .views import (
    CreateCartApiView,
    CartItemApiView,
    CartDetailApiView,
    OrderApiView,
    OrderDetailApiView,
    OrderListApiView,
    UpdateOrderStatusApiView,
)

urlpatterns = [
    # Cart
    path("carts/", CreateCartApiView.as_view(), name="create-cart"),
    path(
        "carts/<uuid:cart_id>/items/",
        CartItemApiView.as_view(),
        name="cart-items",
    ),
    path(
        "carts/<uuid:cart_id>/",
        CartDetailApiView.as_view(),
        name="cart-detail",
    ),

    # Orders
    path(
        "orders/",
        OrderApiView.as_view(),
        name="create-order",
    ),
    path(
        "orders/<str:order_number>/",
        OrderDetailApiView.as_view(),
        name="order-detail",
    ),

    #adminList
    path("admin/orders/", OrderListApiView.as_view(), name="orders"),

    #orderUpdateStatus
    path("admin/orders/<int:pk>/", UpdateOrderStatusApiView.as_view(), name="update-status"),
]