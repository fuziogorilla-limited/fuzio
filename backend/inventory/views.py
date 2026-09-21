from django.db.models import Prefetch
from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product, ProductVariant
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    PublicCategorySerializer,
    PublicProductSerializer,
)


class CategoryApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Category added successfully",
                "category": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request):
        items = Category.objects.all()

        serializer = CategorySerializer(
            items,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):
        item = get_object_or_404(Category, pk=pk)

        serializer = CategorySerializer(
            item,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Category updated successfully",
                "category": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        item = get_object_or_404(Category, pk=pk)

        item.delete()

        return Response(
            {
                "message": "Category deleted successfully",
            },
            status=status.HTTP_200_OK,
        )


class ProductApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Product successfully created",
                "product": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request):
        items = Product.objects.select_related(
            "category"
        ).prefetch_related(
            "variants"
        )

        serializer = ProductSerializer(
            items,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):
        item = get_object_or_404(Product, pk=pk)

        serializer = ProductSerializer(
            item,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Product successfully updated",
                "product": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        item = get_object_or_404(Product, pk=pk)

        item.delete()

        return Response(
            {
                "message": "Product successfully deleted",
            },
            status=status.HTTP_200_OK,
        )


class PublicCategoryApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = Category.objects.filter(
            is_active=True
        )

        serializer = PublicCategorySerializer(
            items,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PublicProductApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = (
            Product.objects
            .filter(is_active=True)
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "variants",
                    queryset=ProductVariant.objects.filter(
                        is_active=True
                    ),
                )
            )
        )

        serializer = PublicProductSerializer(
            items,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )