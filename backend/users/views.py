from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import UpdateUserDataSerializer
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Успешный вход',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    else:
        return Response(
            {'error': 'Неверные учетные данные'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    Token.objects.filter(user=request.user).delete()
    return Response({'message': 'Успешный выход'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({
        'isAuthenticated': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'user_type': request.user.user_type
        }
})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    return Response({
        'isAuthenticated': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'phone': request.user.phone,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'user_type': request.user.user_type
        }
})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_data(request):
    user = request.user
    serializer = UpdateUserDataSerializer(user, data=request.data, partial = True)
    
    if serializer.is_valid():
        serializer.save()
        return Response ({
            'succes': True,
            'user': serializer.data
        })
    else:
        return Response({
            'succes': False,
            'errors': serializer.errors
        }, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response(
            {'error': 'Не вся информация получена'},
            status=400
        )
    
    if not user.check_password(current_password):
        return Response(
            {'error': 'Неправильный пароль'},
            status=400
        )
    
    if user.check_password(new_password):
        return Response(
            {'error': 'Новый пароль совпадает с текущим'},
            status=400
        )
    
    if len(new_password) < 6 or len(new_password) > 50:
        return Response(
            {'error': 'Пароль должен быть от 6 до 50 символов'},
            status=400
        )
    
    user.set_password(new_password)
    user.save()

    return Response(
        {
            'success': True,
            'message': 'Пароль изменен'
        }
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not all([username, email, password]):
        return Response({'error': 'Все поля обязательны'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Логин уже занят'}, status=400)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email уже используется'}, status=400)
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        user.user_type = 'User'
        user.save()

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'success': True,
            'message': 'Регистрация успешна',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_list(request):
    if request.user.user_type != 'Admin':
        return Response({"error": "Доступ запрещен"}, status=403)
    
    users = User.objects.all().order_by('id')
    
    users_data = []
    for user in users:
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })
    
    return Response({'users': users_data})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_role(request, user_id):
    if request.user.user_type != 'Admin':
        return Response({"error": "Доступ запрещен"}, status=403)
    
    user_to_update = get_object_or_404(User, id=user_id)
    
    new_role = request.data.get('user_type')
    
    if not new_role:
        return Response({"error": "Роль не указана"}, status=400)
    
    valid_roles = ['User', 'Manager', 'Admin']
    if new_role not in valid_roles:
        return Response({"error": f"Допустимы только роли: {valid_roles}"}, status=400)
    
    user_to_update.user_type = new_role
    user_to_update.save()
    
    return Response({
        "success": True,
        "message": f"Роль пользователя {user_to_update.username} изменена на {new_role}",
        "user": {
            'id': user_to_update.id,
            'username': user_to_update.username,
            'user_type': user_to_update.user_type
        }
    })