from django.contrib import admin
from .models import *

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Parameter)
admin.site.register(Product_parameters)