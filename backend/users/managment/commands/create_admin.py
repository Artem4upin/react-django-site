from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create admin user if not exists'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'admin123'
        email = 'admin@example.com'

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Superuser "{username}" created with password "{password}"'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠️ Superuser "{username}" already exists'))