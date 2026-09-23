from rest_framework import serializers
from .models import Category, Color, Size, Product, ProductVariant


class CategoryCreateSerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description", "image"]


class CategoriesSerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ColorCreateSerializers(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "name"]


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = "__all__"


class SizeCreateSerializers(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "name"]


class SizeSerializers(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"


class ProductCreateSerializers(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = ["id", "name", "category", "description", "image", "feature", "is_active"]


class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductVariantCreateSerializers(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    color = serializers.PrimaryKeyRelatedField(queryset=Color.objects.all())
    size = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all())

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "product",
            "color",
            "size",
            "quantity",
            "selling_price",
            "buying_price",
            "sku",
            "is_active",
        ]


class ProductVariantSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"


class GuestProductVariantSerializer(serializers.ModelSerializer):
    color = serializers.StringRelatedField()
    size = serializers.StringRelatedField()

    class Meta:
        model = ProductVariant
        exclude = ["buying_price"]


class GuestProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ["date_added"]