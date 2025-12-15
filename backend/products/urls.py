from django.urls import path
from .views import *

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('products/search/', ProductSearch.as_view(), name='product-search'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('brands/', BrandList.as_view(), name='brand-list'),
    path('parameters/', ParametersView.as_view(), name='parameters'),
]