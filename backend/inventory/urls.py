from django.urls import path

from .views import (
    CategoryApiView,
    ProductApiView,
    PublicCategoryApiView,
    PublicProductApiView,
)


urlpatterns = [
    # Admin
    path(
        "categories/",
        CategoryApiView.as_view(),
        name="category-list",
    ),
    path(
        "categories/<int:pk>/",
        CategoryApiView.as_view(),
        name="category-detail",
    ),

    path(
        "products/",
        ProductApiView.as_view(),
        name="product-list",
    ),
    path(
        "products/<int:pk>/",
        ProductApiView.as_view(),
        name="product-detail",
    ),

    # Public
    path(
        "pb/categories/",
        PublicCategoryApiView.as_view(),
        name="public-category-list",
    ),
    path(
        "pb/products/",
        PublicProductApiView.as_view(),
        name="public-product-list",
    ),
]