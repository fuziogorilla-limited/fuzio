from django.db import transaction
from rest_framework import serializers

from .models import Category, Product, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "color",
            "size",
            "quantity",
            "is_active",
        ]
        read_only_fields = ["id"]

    def validate_color(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Color cannot be empty."
            )

        return value

    def validate_size(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Size cannot be empty."
            )

        return value


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "name",
            "description",
            "buying_price",
            "selling_price",
            "image",
            "is_active",
            "feature",
            "date_added",
            "variants",
            "total_quantity",
            "total_value",
        ]
        read_only_fields = [
            "id",
            "date_added",
            "total_quantity",
            "total_value",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Product name cannot be empty."
            )

        return value

    def validate_description(self, value):
        return value.strip()

    def validate_selling_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Selling price cannot be negative."
            )

        return value

    def validate_buying_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Buying price cannot be negative."
            )

        return value

    def validate(self, attrs):
        buying_price = attrs.get(
            "buying_price",
            getattr(self.instance, "buying_price", None),
        )

        selling_price = attrs.get(
            "selling_price",
            getattr(self.instance, "selling_price", None),
        )

        if (
            buying_price is not None
            and selling_price is not None
            and selling_price < buying_price
        ):
            raise serializers.ValidationError({
                "selling_price": (
                    "Selling price cannot be lower than buying price."
                )
            })

        variants = attrs.get("variants")

        if variants is not None:
            combinations = set()

            for variant in variants:
                combination = (
                    variant["color"].strip().lower(),
                    variant["size"].strip().lower(),
                )

                if combination in combinations:
                    raise serializers.ValidationError({
                        "variants": (
                            "Duplicate color and size combinations "
                            "are not allowed."
                        )
                    })

                combinations.add(combination)

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        variants_data = validated_data.pop("variants", [])

        product = Product.objects.create(**validated_data)

        ProductVariant.objects.bulk_create(
            [
                ProductVariant(
                    product=product,
                    **variant,
                )
                for variant in variants_data
            ]
        )

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        variants_data = validated_data.pop("variants", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if variants_data is not None:
            existing_variant_ids = {
                variant.id
                for variant in instance.variants.all()
            }

            submitted_variant_ids = set()

            for variant_data in variants_data:
                variant_id = variant_data.pop("id", None)

                if variant_id is not None:
                    if variant_id not in existing_variant_ids:
                        raise serializers.ValidationError({
                            "variants": (
                                "Invalid variant ID for this product."
                            )
                        })

                    variant = instance.variants.get(id=variant_id)

                    for attr, value in variant_data.items():
                        setattr(variant, attr, value)

                    variant.save()
                    submitted_variant_ids.add(variant_id)

                else:
                    variant = ProductVariant.objects.create(
                        product=instance,
                        **variant_data,
                    )

                    submitted_variant_ids.add(variant.id)

            instance.variants.exclude(
                id__in=submitted_variant_ids
            ).delete()

        return instance


class PublicCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "image",
        ]


class PublicProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "name",
            "description",
            "selling_price",
            "image",
            "is_active",
            "feature",
            "variants",
        ]