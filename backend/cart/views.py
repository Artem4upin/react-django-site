from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import CartItem
from .serializers import CartItemSerializer
from products.models import Product

class CartItems(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk=None):
        if pk is not None:
            cartItem = get_object_or_404(CartItem, id=pk, user=request.user)
            serializer = CartItemSerializer(cartItem, context={'request': request})
            return Response(serializer.data)
        else:
            orders = CartItem.objects.filter(user=request.user)
            serializer = CartItemSerializer(orders, many=True, context={'request': request})
            return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product')
        quantity = request.data.get('quantity', 1)
        product = get_object_or_404(Product, id=product_id)

        cart_item = CartItem.objects.filter(user=request.user, product_id=product_id).first()
        max_quantity = product.quantity

        new_total = quantity
        if cart_item:
            new_total = cart_item.quantity + quantity
        if new_total > max_quantity:
            return Response({'error': 'Недостаточно товара на складе'}, status=400)
        product_id = request.data.get('product')
        quantity = request.data.get('quantity', 1)

        cart_item = CartItem.objects.filter(
            user=request.user,
            product_id=product_id
        ).first()

        if cart_item:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item = CartItem.objects.create(
                user=request.user,
                product_id=product_id,
                quantity=quantity
            )

        return Response({'message': 'Готово'})


    def delete(self, request, pk=None):
        try:
            cartItem = CartItem.objects.get(id=pk, user=request.user)
            cartItem.delete()
            return Response({'success': True, 'message': 'Товар удален из корзины'}, status=200)
        except CartItem.DoesNotExist:
            return Response({'error': 'Товар не найден в корзине'}, status=404)
