from rest_framework import serializers
from .models import Product, Product_parameters

class ProductSerializer(serializers.ModelSerializer):
    parameters = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'creation_date', 'parameters']

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