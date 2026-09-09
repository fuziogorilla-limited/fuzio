from rest_framework.views import APIView
from .serializers import CategorySerializer, ProductSerializer, PublicCategorySerializer, PublicProductSerializer
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from.models import Category, Product
from django.shortcuts import get_object_or_404

class CategoryApiView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def post(self, request):
        serializer=CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message":"Category added successfully",
            "category":serializer.data
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        items=Category.objects.all()
        serializer=CategorySerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        item=get_object_or_404(Category, pk=pk)
        serializer=CategorySerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"Category updated successfully",
            "category":serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        item=get_object_or_404(Category, pk=pk)
        item.delete()
        return Response({
            "message":f"Category deleted successfully"
        }, status=status.HTTP_200_OK)

class ProductApiView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def post(self, request):
        serializer=ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"Product successfully created",
            "product":serializer.data
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        items=Product.objects.all()
        serializer=ProductSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        item=get_object_or_404(Product, pk=pk)
        serializer=ProductSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"Product successfully updated",
            "product":serializer.data,
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        item=get_object_or_404(Product, pk=pk)
        item.delete()
        return Response({
            "message":"Product successfully deleted"
        }, status=status.HTTP_200_OK)

class PublicCategoryApiView(APIView):
    permission_classes=[permissions.AllowAny]

    def get(self, request):
        items=Category.objects.all()
        serializer=PublicCategorySerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PublicProductApiView(APIView):
    permission_classes=[permissions.AllowAny]

    def get(self, request):
        items=Product.objects.all()
        serializer=PublicProductSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)