import json
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response  
from .models import Category, Product
from .serializers import *
from django.contrib.postgres.search import SearchVector
from .premissions import IsManager

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
    
    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        allowed_fields = ['name', 'price', 'quantity', 'description']
        data = request.data
        
        for field in allowed_fields:
            if field in data:
                setattr(product, field, data[field])
        
        try:
            product.save()
            serializer = ProductSerializer(product, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    
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
    
class ProductCreate(APIView):
    permission_classes = [IsManager]
    
    def post(self, request):        
        try:
            data = request.data
            
            product = Product.objects.create(
                name=data.get('name'),
                price=float(data.get('price', 0)),
                quantity=int(data.get('quantity', 1)),
                description=data.get('description', ''),
                brand_id=data.get('brand'),
                category_id=data.get('category'),
                subcategory_id=data.get('subcategory'),
            )
            
            if 'image' in request.FILES:
                product.image_pass = request.FILES['image']
                product.save()
            
            parameters_json = data.get('parameters')
            if parameters_json:
                try:
                    parameters_data = json.loads(parameters_json)
                    for param_data in parameters_data:
                        if isinstance(param_data, dict) and 'parameter' in param_data and 'value' in param_data:
                            Product_parameters.objects.create(
                                product=product,
                                parameter_id=param_data['parameter'],
                                value=param_data['value']
                            )
                except Exception as e:
                    print(f"Ошибка при создании параметров: {e}")
            
            serializer = ProductSerializer(product, context={'request': request})
            return Response(serializer.data, status=201)
            
        except Exception as e:
            print(f"Общая ошибка создания товара: {e}")
            return Response({"error": str(e)}, status=400)