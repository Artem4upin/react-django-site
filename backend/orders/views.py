from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .premissions import IsManager
from .models import Order, OrderItem
from cart.models import Cart_item
from .serializers import OrderSerializer

class UserOrders(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('orderitem_set')
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)
    
    def post(self, request):
        
        delivery_address = request.data.get('delivery_address')
        delivery_date = request.data.get('delivery_date')
        cart_items_id = request.data.get('cart_items', [])
        
        if not delivery_address:
            return Response({"error": "Адрес доставки обязателен"}, status=400)
        
        if not delivery_date:
            return Response({"error": "Дата доставки обязательна"}, status=400)
        
        if not cart_items_id:
            return Response({"error": "Выберите товары для заказа"}, status=400)
        
        order = Order.objects.create(
            user=request.user,
            delivery_address=delivery_address,
            delivery_date=delivery_date,
            status='Created'
        )
        
        cart_items = Cart_item.objects.filter(
            id__in=cart_items_id,
            user=request.user
        )
        
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_price=cart_item.product.price,
                quantity=cart_item.quantity
            )
            cart_item.delete()
        
        order.calculate_total()
        order.save()
        
        serializer = OrderSerializer(order)
        return Response({
            "success": True,
            "order_id": order.id,
            "order_number": order.order_number,
            "order": serializer.data
        }, status=201)
    
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
        
        if new_status == 'Completed':
            for item in order.orderitem_set.all():
                 if item.product:
                    item.product.quantity -= item.quantity
                    item.product.save()

        if new_status in ['Completed', 'Canceled']:
            order.delete()

            return Response({
            "message": f"Заказ {order_id} завершен и перемещен в архив",
            "order_id": order_id,
            "status": new_status
        }, status=200)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    def delete(self, request, order_id=None):
        if order_id is None:
            return Response({"error": "ID заказа не указан"}, status=400)

        order = get_object_or_404(Order, id=order_id)
        order.hard_delete()
        return Response({"message": "Заказ полностью удален"}, status=204)