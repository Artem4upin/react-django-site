from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import CartItem
from .serializers import CartItemSerializer

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
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


    def delete(self, request, pk=None):
        try:
            cartItem = CartItem.objects.get(id=pk, user=request.user)
            cartItem.delete()
            return Response({'success': True, 'message': 'Товар удален из корзины'}, status=200)
        except CartItem.DoesNotExist:
            return Response({'error': 'Товар не найден в корзине'}, status=404)
