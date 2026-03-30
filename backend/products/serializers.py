from rest_framework import serializers
from .models import *
from users.serializers import UserSerializer

class ProductSerializer(serializers.ModelSerializer):
    parameters = serializers.SerializerMethodField()
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    subcategory_id = serializers.IntegerField(source='subcategory.id', read_only=True)
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'quantity',
            'brand',
            'description',
            'creation_date',
            'parameters',
            'category_id',
            'subcategory_id',
            'image_path',
            'rating_avg'
        ]

    def get_parameters(self, product_obj):
        product_params = ProductParameter.objects.filter(product=product_obj)

        result = []
        for i in product_params:
            if i.parameter:
                result.append({
                    'param_id': i.parameter.id,
                    'name': i.parameter.name,
                    'value': i.value
                })

        return result

class CategoryGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryGroup
        fields = ['id', 'name']

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    category_group = CategoryGroupSerializer(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'subcategories', 'category_group']
    
    def get_subcategories(self, obj):
        subcategories = obj.subcategory_set.all()
        return SubcategorySerializer(subcategories, many=True).data
    
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id',
                  'product',
                  'user',
                  'rating',
                  'comment',
                  'created_at',
                  'image_path'
                  ]
