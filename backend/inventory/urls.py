from django.urls import path
from .views import(
    AdminCategoryApiView,
    AdminColorApiView,
    AdminSizeApiView,
    AdminProductApiView,
    AdminProductVariantApiView,
    GuestProductApiView, 
    GuestProductVariantApiView,
    GuestCategoryApiView,
)

urlpatterns=[
    #admin routes
    path("category/", AdminCategoryApiView.as_view(), name="categories"),
    path("category/<int:pk>/", AdminCategoryApiView.as_view(), name="category"),
    path("color/", AdminColorApiView.as_view(), name="colors"),
    path("color/<int:pk>/", AdminColorApiView.as_view(), name="color"),
    path("size/", AdminSizeApiView.as_view(), name="sizes"),
    path("size/<int:pk>/", AdminSizeApiView.as_view(), name="size"),
    path("product/", AdminProductApiView.as_view(), name="products"),
    path("product/<int:pk>/", AdminProductApiView.as_view(), name="product"),
    path("product/variant/", AdminProductVariantApiView.as_view(), name="product-variants"),
    path("product/variant/<int:pk>/", AdminProductVariantApiView.as_view(), name="product-variant"),

    #guest routes
    path("guest/product/", GuestProductApiView.as_view(), name="guest-products"),
    path("guest/category/", GuestCategoryApiView.as_view(), name="guest-category"),
    path("guest/product/variants/", GuestProductVariantApiView.as_view(), name="guest-variants"),
]