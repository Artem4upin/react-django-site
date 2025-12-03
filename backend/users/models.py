from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPES = [
    ('User', 'Пользователь'),
    ('Manager', 'Менеджер'),
    ('Admin', 'Админ')
    ]

    user_type = models.CharField(choices=USER_TYPES,max_length=50, default='User')
    phone = models.CharField(max_length=20, blank=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def __str__(self):
        return self.username
