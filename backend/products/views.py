from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response  
from .models import Category, Product
from .serializers import *
from django.contrib.postgres.search import SearchVector

class ProductList(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        is_new = request.query_params.get('new', '').lower() == 'true'
        
        if is_new:
            products = Product.objects.all().order_by('-creation_date')[:2]
        else:
            products = Product.objects.all()
            
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class ProductDetail(APIView):
    
    authentication_classes = []
    permission_classes = []

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    
class ProductSearch(APIView):
    def get(self, request):
        query = request.GET.get('search', '')
        
        products = Product.objects.annotate(
            search=SearchVector('name', 'description')
        ).filter(search=query)
        
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    
class CategoryList(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = Category.objects.prefetch_related('subcategory_set').all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
class BrandList(APIView):
    
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)
    
class ParametersView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def get(self, request):
        parameters_data = []
        
        parameters = Parameter.objects.all()
        
        for param in parameters:
            values = Product_parameters.objects.filter(
                parameter=param
            ).values_list('value', flat=True).distinct()
            
            if values:
                parameters_data.append({
                    'id': param.id,
                    'name': param.name,
                    'category_id': param.category.id,
                    'category_name': param.category.name,
                    'values': list(values)
                })
        
        return Response(parameters_data)