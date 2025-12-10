from django.db import models
from users.models import User
from products.models import Product
import uuid

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def delete(self):
        self.is_deleted = True
        self.save()

    def hard_delete(self):
        super().delete()
        
class Order(SoftDeleteModel):
    STATUS_CHOICES = [
        ('Created', 'Создан'),
        ('Work', 'В работе'),
        ('Sent', 'Отправлен'),
        ('Done', 'Готов к выдаче'),
        ('Completed', 'Завершен'),
        ('Canceled', 'Отменен')
    ]
    
    status = models.CharField(choices=STATUS_CHOICES, default='Created')
    order_number = models.CharField(max_length=50, unique=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    price_sum = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateField(auto_now=False, auto_now_add=True)
    delivery_date = models.DateField(auto_now=False, auto_now_add=False)
    delivery_address = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"{uuid.uuid4().hex[:8].upper()}" 

        if self.pk:
            self.calculate_total()
                   
        super().save(*args, **kwargs)

    def calculate_total(self):
        items = self.orderitem_set.all()
        total = sum(item.product_price * item.quantity for item in items)
        self.price_sum = total

    def __str__(self):
        return f"{self.order_number}"
    
        
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=100, blank=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        if not self.product_name:
            self.product_name = self.product.name
            self.product_price = self.product.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order}: {self.product} - {self.quantity}"