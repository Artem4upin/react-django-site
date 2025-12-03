from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response  
from .models import Product
from .serializers import ProductSerializer

class ProductList(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    
    authentication_classes = []
    permission_classes = []

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)