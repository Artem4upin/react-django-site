from django.urls import path
from .views import UserOrders

urlpatterns = [
    path('user-orders/', UserOrders.as_view(), name='user-orders'),
]
