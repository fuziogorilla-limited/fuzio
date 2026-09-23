from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from .serializers import(
    CategoriesSerializers,
    CategoryCreateSerializers,
    ColorCreateSerializers,
    ColorSerializer,
    SizeCreateSerializers,
    SizeSerializers,
    ProductCreateSerializers,
    ProductSerializers,
    ProductVariantCreateSerializers,
    ProductVariantSerializers,
    GuestProductVariantSerializer,
    GuestProductSerializer
)
from .models import(
    Category, 
    Product,
    Size,
    Color,
    ProductVariant
)

class AdminCategoryApiView(APIView):
    permission_classes=[permissions.IsAdminUser]

    #create a category
    def post(self, request):
        serializer=CategoryCreateSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"category added successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)

    #get all categories
    def get(self, request):
        items=Category.objects.all()
        serializer=CategoriesSerializers(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #update a category
    def patch(self, request, pk):
        item=get_object_or_404(Category, pk=pk)
        serializer=CategoryCreateSerializers(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"category updated successfully",
            "data":serializer.data
        }, status=status.HTTP_200_OK)

    #delete a category
    def delete(self, request, pk):
        item=get_object_or_404(Category, pk=pk)
        item.delete()
        return Response({
            "message":"category deleted successfully",
        },status=status.HTTP_200_OK)


class AdminColorApiView(APIView):
    permission_classes=[permissions.IsAdminUser]

    #create a color
    def post(self, request):
        serializer=ColorCreateSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"color created successfully",
            "data":serializer.data
        }, status=status.HTTP_201_CREATED)

    #get all colors
    def get(self, request):
        items=Color.objects.all()
        serializer=ColorSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #update a color
    def patch(self, request, pk):
        item=get_object_or_404(Color, pk=pk)
        serializer=ColorCreateSerializers(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"color updated successfully",
            "data":serializer.data
        }, status=status.HTTP_200_OK)

    #delete a color
    def delete(self, request, pk):
        item=get_object_or_404(Color, pk=pk)
        item.delete()
        return Response({
            "message":"Color deleted successfully"
        },status=status.HTTP_200_OK)

class AdminSizeApiView(APIView):
    permission_classes=[permissions.IsAdminUser]

    #create a size
    def post(self, request):
        serializer=SizeCreateSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"size created successfully",
            "data":serializer.data
        }, status=status.HTTP_201_CREATED)

    #get all size
    def get(self, request):
        items=Size.objects.all()
        serializer=SizeSerializers(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #update a size
    def patch(self, request, pk):
        item=get_object_or_404(Size, pk=pk)
        serializer=SizeCreateSerializers(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"size updated successfully",
            "data":serializer.data
        }, status=status.HTTP_200_OK)

    #delete a size
    def delete(self, request, pk):
        item=get_object_or_404(Size, pk=pk)
        item.delete()
        return Response({
            "message":"size deleted successfully"
        },status=status.HTTP_200_OK)


class AdminProductApiView(APIView):
    permission_classes=[permissions.IsAdminUser]

    #create a product
    def post(self, request):
        serializer=ProductCreateSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"product created successfully",
            "data":serializer.data
        }, status=status.HTTP_201_CREATED)

    #get all products
    def get(self, request):
        items=Product.objects.all()
        serializer=ProductSerializers(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #update a product
    def patch(self, request, pk):
        item=get_object_or_404(Product, pk=pk)
        serializer=ProductCreateSerializers(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"product updated successfully",
            "data":serializer.data
        }, status=status.HTTP_200_OK)

    #delete a product
    def delete(self, request, pk):
        item=get_object_or_404(Product, pk=pk)
        item.delete()
        return Response({
            "message":"product deleted successfully"
        }, status=status.HTTP_200_OK)

class AdminProductVariantApiView(APIView):
    permission_classes=[permissions.IsAdminUser]

    #create product variant
    def post(self, request):
        serializer=ProductVariantCreateSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"variant added successfully",
            "data":serializer.data
        }, status=status.HTTP_201_CREATED)

    #get all products
    def get(self, request):
        items=ProductVariant.objects.all()
        serializer=ProductVariantSerializers(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    #update product variant
    def patch(self, request, pk):
        item=get_object_or_404(ProductVariant, pk=pk)
        serializer=ProductVariantCreateSerializers(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message":"variant updated successfully",
            "data":serializer.data
        }, status=status.HTTP_200_OK)

    #delete variant
    def delete(self, request, pk):
        item=get_object_or_404(ProductVariant, pk=pk)
        item.delete()
        return Response({
            "message":"variant deleted successfully"
        }, status=status.HTTP_200_OK)


#Public views
class GuestProductApiView(APIView):
    permission_classes=[permissions.AllowAny]

    #get products
    def get(self, request):
        items=Product.objects.filter(is_active=True)
        serializer=GuestProductSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GuestProductVariantApiView(APIView):
    permission_classes=[permissions.AllowAny]

    #get product variants
    def get(self, request):
        items=ProductVariant.objects.filter(is_active=True)
        serializer=GuestProductVariantSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GuestCategoryApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = Category.objects.filter(is_active=True)
        serializer = CategoriesSerializers(items, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )