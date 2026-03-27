import json
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response  
from .models import Category, Product
from .serializers import *
from django.contrib.postgres.search import SearchVector
from .permissions import IsManager
from rest_framework.pagination import PageNumberPagination
from backend.config import PRODUCT_PAGE_SIZE

class ProductList(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        category_id = request.query_params.get('category_id')
        subcategory_id = request.query_params.get('subcategory_id')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        brand_id = request.query_params.get('brand_id')
        param_id = request.query_params.get('param_id')
        param_value = request.query_params.get('param_value')
        in_stock = request.query_params.get('in_stock')
        is_new = request.query_params.get('new', '').lower() == 'true'

        if is_new:
            products = Product.objects.all().order_by('-creation_date')[:2]
        else:
            products = Product.objects.all()

        if category_id:
            products = products.filter(category_id=category_id)
        if subcategory_id:
            products = products.filter(subcategory_id=subcategory_id)
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        if brand_id:
            products = products.filter(brand_id=brand_id)
        if in_stock is not None:
            if in_stock == 'false':
                pass
            elif in_stock == 'true':
                products = products.filter(quantity__gt=0)
        if param_id and param_value:
            products = products.filter(
                productparameter__parameter_id=param_id,
                productparameter__value=param_value
            ).distinct()

        pagination = PageNumberPagination()
        pagination.page_size = PRODUCT_PAGE_SIZE
        result_page = pagination.paginate_queryset(products, request)

        serializer = ProductSerializer(result_page, many=True, context={'request': request})
        return pagination.get_paginated_response(serializer.data)

class ProductDetail(APIView):
    
    authentication_classes = []
    permission_classes = []

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        allowed_fields = ['id', 'name', 'price', 'quantity', 'description']
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
    
class Parameters(APIView):
    authentication_classes = []
    permission_classes = []
    
    def get(self, request):
        parameters_data = []
        
        parameters = Parameter.objects.all()
        
        for param in parameters:
            values = ProductParameter.objects.filter(
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
                product.image_path = request.FILES['image']
                product.save()
            
            parameters_json = data.get('parameters')
            if parameters_json:
                try:
                    parameters_data = json.loads(parameters_json)
                    for param_data in parameters_data:
                        if isinstance(param_data, dict) and 'parameter' in param_data and 'value' in param_data:
                            ProductParameter.objects.create(
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

class ProductReviews(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
