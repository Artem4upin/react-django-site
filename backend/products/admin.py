from django.contrib import admin
from .models import *

admin.site.register(CategoryGroup)
admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(Parameter)
admin.site.register(ProductParameter)
admin.site.register(Brand)
admin.site.register(Review)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'quantity', 'rating_avg']
    actions = ['recalculate_ratings']

    def recalculate_ratings(self, request, queryset):
        for product in queryset:
            product.update_rating()
        self.message_user(request, f"Рейтинги пересчитаны для {queryset.count()} товаров")
    recalculate_ratings.short_description = "Пересчитать рейтинг"