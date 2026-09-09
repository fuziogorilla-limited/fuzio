from .views import PublicCategoryApiView, PublicProductApiView, CategoryApiView, ProductApiView
from django.urls import path

urlpatterns=[
    #get, post
    path("categories/", CategoryApiView.as_view(), name="category"),
    path("products/", ProductApiView.as_view(), name="product"),
    #patch delete
    path("category/<int:pk>/",CategoryApiView.as_view(), name="category-maintain"),
    path("product/<int:pk>/",ProductApiView.as_view(), name="product-maintain"),
    #public routes
    path("pb/categories/", PublicCategoryApiView.as_view(), name="pb-category"),
    path("pb/products/", PublicProductApiView.as_view(), name="pb-product"),
]