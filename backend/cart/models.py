from django.db import models
from users.models import User
from products.models import Product

class Cart_item(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.user} {self.product}"