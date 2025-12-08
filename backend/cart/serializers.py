from rest_framework import serializers
from .models import *
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart_item
        fields = ['id', 
                  'user', 
                  'product', 
                  'quantity', 
                  'product_name', 
                  'product_price']
        
        read_only_fields = ['user'] 