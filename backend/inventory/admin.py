from django.contrib import admin

from .models import (
    Category,
    Color,
    Size,
    Product,
    ProductVariant,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "date_added",
    )
    list_filter = (
        "is_active",
    )
    search_fields = (
        "name",
        "description",
    )
    ordering = (
        "name",
    )


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "created_at",
    )
    search_fields = (
        "name",
    )
    ordering = (
        "name",
    )


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "created_at",
    )
    search_fields = (
        "name",
    )
    ordering = (
        "name",
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "is_active",
        "feature",
        "date_added",
    )
    list_filter = (
        "category",
        "is_active",
        "feature",
    )
    search_fields = (
        "name",
        "description",
    )
    autocomplete_fields = (
        "category",
    )
    ordering = (
        "-date_added",
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "sku",
        "product",
        "color",
        "size",
        "quantity",
        "selling_price",
        "buying_price",
        "total_value",
        "is_active",
    )
    list_filter = (
        "is_active",
        "color",
        "size",
    )
    search_fields = (
        "sku",
        "product__name",
    )
    autocomplete_fields = (
        "product",
        "color",
        "size",
    )
    list_editable = (
        "quantity",
        "selling_price",
        "is_active",
    )
    ordering = (
        "product",
        "color",
        "size",
    )