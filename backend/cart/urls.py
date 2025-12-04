from django.urls import path
from .views import CartItems

urlpatterns = [
    path('cart-items/', CartItems.as_view(), name='cart-items'),
]
