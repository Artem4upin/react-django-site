from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import UpdateUserDataSerializer
from django.contrib.auth.hashers import check_password

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
            'email': request.user.email
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