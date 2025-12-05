from rest_framework import serializers
from .models import User

class UpdateUserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username' ,'email', 'phone', 'first_name', 'last_name', 'user_type']

    def validate_email(self, value):
        user = self.instance
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Этот email уже используется")
        return value
    
    def validate_username(self, value):
        user = self.instance
        if User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Этот логин уже занят")
        return value