from django.db import models
from users.models import User

class CategoryGroup(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=50)
    category_group = models.ForeignKey(CategoryGroup, on_delete=models.PROTECT, null=True, blank=True)
    def __str__(self):
        return self.name

class Subcategory(models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.category.name}"

class Brand(models.Model):
    name = models.CharField(max_length=50)
    image_path = models.ImageField(upload_to='brands/', blank=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True, blank=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.PROTECT, null=True, blank=True)
    description = models.TextField(blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    image_path = models.ImageField(upload_to='images/', blank=True)
    rating_avg = models.DecimalField(max_digits=2, decimal_places=1, default=0, null=True)

    def update_rating(self):
        reviews = self.review_set.all()
        if reviews.exists():
            avg = sum(r.rating for r in reviews) / reviews.count()
            self.rating_avg = round(avg, 2)
        else:
            self.rating_avg = 0
        self.save(update_fields=['rating_avg'])

    def __str__(self):
        return self.name

class Parameter(models.Model):
    name = models.CharField(max_length=50, default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.category.name}: {self.name}"
 
class ProductParameter(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    parameter = models.ForeignKey(Parameter, on_delete=models.CASCADE, null=True)
    value = models.CharField(max_length=500, default='')


    def __str__(self):
        return f"{self.product.name} - {self.parameter.name}: {self.value}"

class Review(models.Model):

    RATING_CHOICES = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(max_length=500,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image_path = models.ImageField(upload_to='reviews/', blank=True, null=True)

    class Meta:
        unique_together = ['user', 'product']

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        product.update_rating()

    def __str__(self):
        return f'{self.user} - {self.product.name}'