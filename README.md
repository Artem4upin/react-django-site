# Запуск

Команды выполнять в терминале с директории проекта

## React

cd frontend

### установка зависимостей

npm install

### Запуск фронта

npm run dev

## Django

cd backend

### Создание виртуального окружения

python -m venv venv

### Активация

.\venv\Scripts\Activate

### Установка зависимостей

pip install -r requirements.txt

### Запуск бэка

python manage.py runserver

## Если нужны миграции

python manage.py makemigrations - создать миграции
python manage.py migrate - применить миграции

## Создание пользователя сейчас только через createsuperuser

python manage.py createsuperuser