from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Cart_item
from .serializers import CartItemSerializer

class CartItems(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        orders = Cart_item.objects.filter(user=request.user)
        serializer = CartItemSerializer(orders, many=True)
        return Response(serializer.data)
    
    # Добавление
    def post(self, request):
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        try:
            cart_item = Cart_item.objects.get(id=pk, user=request.user)
            cart_item.delete()
            return Response({'success': True, 'message': 'Товар удален из корзины'}, status=200)
        except Cart_item.DoesNotExist:
            return Response({'error': 'Товар не найден в корзине'}, status=404)
