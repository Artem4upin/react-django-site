from django.urls import path
from .views import CartItems

urlpatterns = [
    path('cart-items/', CartItems.as_view(), name='cart-items'),
    path('cart-items/<int:pk>/', CartItems.as_view(), name='cart-item-detail'),
]
