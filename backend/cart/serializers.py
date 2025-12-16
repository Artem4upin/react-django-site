from rest_framework import serializers
from .models import *
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    image_pass = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart_item
        fields = ['id', 
                  'user', 
                  'product', 
                  'quantity', 
                  'product_name', 
                  'product_price',
                  'image_pass']
        
        read_only_fields = ['user'] 

    def get_image_pass(self, obj):
        if obj.product and obj.product.image_pass:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image_pass.url)
            return obj.product.image_pass.url
        return None