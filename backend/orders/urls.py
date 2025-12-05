from django.urls import path
from .views import UserOrders, ManagerOrders

urlpatterns = [
    path('user-orders/', UserOrders.as_view(), name='user-orders'),

    path('manager-orders/', ManagerOrders.as_view(), name='manager-orders'),
    path('manager-orders/<int:order_id>/', ManagerOrders.as_view(), name='manager-order-detail'),
]
