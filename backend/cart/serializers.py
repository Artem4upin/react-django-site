from rest_framework import serializers
from .models import *
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):

    product_data = ProductSerializer(source='product', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True, coerce_to_string=False)

    image_path = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 
                  'user', 
                  'product',
                  'product_data',
                  'quantity', 
                  'product_name', 
                  'product_price',
                  'image_path']
        
        read_only_fields = ['user'] 

    def get_image_path(self, obj):
        if obj.product and obj.product.image_path:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image_path.url)
            return obj.product.image_path.url
        return None