from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('products/search/', ProductSearch.as_view(), name='product-search'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('brands/', BrandList.as_view(), name='brand-list'),
    path('parameters/', Parameters.as_view(), name='parameters'),
    path('products/create/', ProductCreate.as_view(), name='product-create'),
    path('products/reviews/<int:product_id>/', ProductReviews.as_view(), name='product-reviews'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)