from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('check-auth/', views.check_auth, name='check-auth'),
    path('get-user-data/', views.get_user_data, name='get-user-data'),
    path('update-user-data/', views.update_user_data, name='update-user-data'),
    path('change-password/', views.change_password, name='change-password'),
    path('users/', views.get_users_list, name='get-users-list'),
    path('users/<int:user_id>/update-role/', views.update_user_role, name='update-user-role'),
]