from rest_framework import serializers
from .models import Category, Product, Product_parameters, Subcategory

class ProductSerializer(serializers.ModelSerializer):
    parameters = serializers.SerializerMethodField()
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    subcategory_id = serializers.IntegerField(source='subcategory.id', read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'creation_date', 'parameters', 'category_id', 'subcategory_id']


    def get_parameters(self, product_obj):
        product_params = Product_parameters.objects.filter(product=product_obj)

        result = []
        for i in product_params:
            if i.parameter:
                result.append({
                    'name': i.parameter.name,
                    'value': i.value
                })

        return result 
class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'subcategories']
    
    def get_subcategories(self, obj):
        subcategories = obj.subcategory_set.all()
        return SubcategorySerializer(subcategories, many=True).data