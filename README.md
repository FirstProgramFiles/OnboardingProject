# 🚀 Onboarding - Система адаптации сотрудников

Современное веб-приложение для управления процессом онбординга новых сотрудников в компании.

## ✨ Возможности

- 👥 **Управление сотрудниками** - регистрация, профили, аватары
- 🏢 **Организационная структура** - отделы, должности, роли
- 📋 **Система задач** - создание и отслеживание задач адаптации
- 📊 **Прогресс-трекинг** - визуализация прогресса по этапам
- 📖 **PDF-гид** - интерактивный просмотр руководства новичка
- 🔐 **Безопасность** - JWT аутентификация, ролевая модель
- 📱 **Адаптивный дизайн** - работает на всех устройствах

## 🛠️ Технологии

### Frontend
- **Vue 3** - современный фреймворк
- **Vite** - быстрый сборщик
- **Tailwind CSS** - утилитарные стили
- **Pinia** - управление состоянием
- **Vue Router** - маршрутизация

### Backend
- **Node.js** - серверная платформа
- **Express.js** - веб-фреймворк
- **Prisma** - ORM для работы с БД
- **PostgreSQL** - реляционная БД
- **JWT** - аутентификация
- **Multer** - загрузка файлов
- **Sharp** - обработка изображений

### DevOps
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация
- **Nginx** - reverse proxy
- **SSL/TLS** - безопасное соединение

## ⚡ Быстрый старт

### Развёртывание за 3 шага

```bash
# 1. Клонирование
git clone <your-repo-url>
cd Onboarding

# 2. Запуск (выберите один вариант)
./deploy.sh          # Продакшн
./deploy-dev.sh      # Разработка (с hot-reload)

# 3. Проверка
./test-deployment.sh
```

### Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **База данных**: localhost:5432

## 📚 Документация

- [🚀 Быстрый старт](QUICKSTART.md) - развёртывание за 3 шага
- [📖 Полное руководство](DEPLOYMENT.md) - детальная документация
- [🔧 Разработка](DEVELOPMENT.md) - руководство для разработчиков

## 🐳 Docker команды

### Основные команды

```bash
# Управление приложением
./deploy.sh start      # Запуск
./deploy.sh stop       # Остановка
./deploy.sh restart    # Перезапуск
./deploy.sh logs       # Просмотр логов
./deploy.sh update     # Обновление

# Работа с базой данных
./deploy.sh backup     # Создание бэкапа
./deploy.sh restore    # Восстановление из бэкапа

# Разработка
./deploy-dev.sh        # Запуск в режиме разработки
./deploy-dev.sh logs   # Просмотр логов разработки
```

## 🏗️ Архитектура

```
Onboarding/
├── frontend/          # Vue 3 приложение
│   ├── src/
│   │   ├── components/    # Vue компоненты
│   │   ├── views/         # Страницы
│   │   ├── stores/        # Pinia stores
│   │   └── router/        # Маршрутизация
│   └── Dockerfile
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/   # Контроллеры
│   │   ├── routes/        # Маршруты API
│   │   ├── middlewares/   # Middleware
│   │   └── utils/         # Утилиты
│   ├── prisma/        # Схема БД
│   └── Dockerfile
├── docker-compose.yml     # Продакшн конфигурация
├── docker-compose.dev.yml # Разработка конфигурация
├── deploy.sh              # Скрипт развёртывания
├── deploy-dev.sh          # Скрипт разработки
└── nginx.conf             # Nginx конфигурация
```

## 📊 Мониторинг

### Health checks

- Frontend: `http://localhost:3000/health`
- Backend: `http://localhost:8000/api/health`
- Nginx: `https://localhost/health`

### Логи

```bash
# Все логи
./deploy.sh logs

# Логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## 🔄 Обновление

### Автоматическое обновление

```bash
./deploy.sh update
```

### Ручное обновление

```bash
./deploy.sh stop
git pull origin main
./deploy.sh
```

## 🆘 Поддержка

### Частые проблемы

1. **Порт уже занят** - проверьте `netstat -tulpn | grep :8000`
2. **Ошибки сборки Docker** - выполните `docker system prune -a`
3. **Проблемы с БД** - проверьте логи `docker-compose logs postgres`
4. **SSL ошибки** - проверьте сертификаты

### Получение помощи

1. Проверьте логи: `./deploy.sh logs`
2. Убедитесь, что все порты свободны
3. Проверьте переменные окружения
4. Очистите Docker кэш: `docker system prune -a`

## 📈 Масштабирование

### Горизонтальное масштабирование

```bash
# Масштабирование backend
docker-compose up -d --scale backend=3
```

### Вертикальное масштабирование

Отредактируйте `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```
 [инструкции быстрого старта](QUICKSTART.md). 
