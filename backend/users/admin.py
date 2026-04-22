from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.core.management import call_command
from django.db import connection
from django.contrib import messages
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'user_type', 'is_staff']
    list_filter = ['user_type', 'is_staff']

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('load-fixtures/', self.admin_site.admin_view(self.load_fixtures), name='load-fixtures'),
            path('load-sql/', self.admin_site.admin_view(self.load_sql), name='load-sql'),
        ]
        return custom_urls + urls

    def load_fixtures(self, request):
        if request.method == 'POST':
            try:
                fixtures_file = request.FILES.get('fixtures_file')
                if not fixtures_file:
                    messages.error(request, 'Файл не выбран')
                    return redirect('admin:users_user_changelist')

                import tempfile
                with tempfile.NamedTemporaryFile(mode='wb', suffix='.json', delete=False) as f:
                    for chunk in fixtures_file.chunks():
                        f.write(chunk)
                    temp_file = f.name

                call_command('loaddata', temp_file, verbosity=1)

                import os
                os.unlink(temp_file)

                messages.success(request, 'Фикстура успешно загружена')
            except Exception as e:
                messages.error(request, f'Ошибка: {e}')
            return redirect('admin:users_user_changelist')

        return render(request, 'admin/load_fixtures.html', {})

    def load_sql(self, request):
        if request.method == 'POST':
            try:
                sql_file = request.FILES.get('sql_file')
                if not sql_file:
                    messages.error(request, 'Файл не выбран')
                    return redirect('admin:users_user_changelist')

                sql_content = sql_file.read().decode('utf-8')
                with connection.cursor() as cursor:
                    cursor.execute(sql_content)

                messages.success(request, 'SQL файл успешно загружен')
            except Exception as e:
                messages.error(request, f'Ошибка: {e}')
            return redirect('admin:users_user_changelist')

        return render(request, 'admin/load_sql.html', {})

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['load_fixtures_url'] = 'admin:load-fixtures'
        extra_context['load_sql_url'] = 'admin:load-sql'
        return super().changelist_view(request, extra_context=extra_context)