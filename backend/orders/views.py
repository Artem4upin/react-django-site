from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .premissions import IsManager
from .models import Order
from .serializers import OrderSerializer

class UserOrders(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('orderitem_set')
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)
    
class ManagerOrders(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsManager]
    
    def get(self, request, order_id=None):
        if order_id is not None:
            order = get_object_or_404(Order, id=order_id)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        else:
            orders = Order.objects.all().prefetch_related('orderitem_set').select_related('user')
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
    
    def patch(self, request, order_id=None):
        if order_id is None:
            return Response({"error": "ID заказа не указан"}, status=400)
        order = get_object_or_404(Order, id=order_id)
        
        new_status = request.data.get('status')
        if not new_status:
            return Response({"error": "Статус не указан"}, status=400)
        
        valid_statuses = ['Created', 'Work', 'Sent', 'Done', 'Completed', 'Canceled']
        if new_status not in valid_statuses:
            return Response({"error": f"Допустимы только статусы: {valid_statuses}"}, status=400)
        
        order.status = new_status
        order.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    def delete(self, request, order_id=None):
        if order_id is None:
            return Response({"error": "ID заказа не указан"}, status=400)
        
        order = get_object_or_404(Order, id=order_id)
        order.delete()
        return Response({"message": "Заказ удален"}, status=204)