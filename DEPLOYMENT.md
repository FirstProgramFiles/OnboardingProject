# 🚀 Развёртывание Onboarding приложения

Это руководство поможет вам быстро развернуть приложение для онбординга сотрудников на любом сервере.

## 📋 Требования

- **Docker** (версия 20.10+)
- **Docker Compose** (версия 2.0+)
- **Git** (для клонирования репозитория)
- **OpenSSL** (для создания SSL сертификатов)

## 🎯 Варианты развёртывания

### 1. Быстрое развёртывание (рекомендуется)

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd Onboarding

# Запустите развёртывание
./deploy.sh
```

### 2. Развёртывание в режиме разработки

```bash
# Запустите в режиме разработки с hot-reload
./deploy-dev.sh
```

### 3. Ручное развёртывание

```bash
# Создайте .env файл
cp .env.example .env

# Отредактируйте переменные окружения
nano .env

# Запустите через Docker Compose
docker-compose up -d
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` в корневой директории:

```env
# База данных
POSTGRES_DB=onboarding
POSTGRES_USER=onboarding_user
POSTGRES_PASSWORD=your-secure-password

# JWT секрет (обязательно измените!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Порт для backend
BACKEND_PORT=8000

# Порт для frontend
FRONTEND_PORT=3000

# Домен (замените на свой)
DOMAIN=your-domain.com

# Режим (production/development)
NODE_ENV=production
```

### SSL сертификаты

Для продакшена замените самоподписанные сертификаты на настоящие:

```bash
# Создайте директорию для сертификатов
mkdir -p ssl

# Скопируйте ваши сертификаты
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem
```

## 🐳 Docker команды

### Основные команды

```bash
# Запуск приложения
./deploy.sh

# Остановка приложения
./deploy.sh stop

# Перезапуск приложения
./deploy.sh restart

# Просмотр логов
./deploy.sh logs

# Обновление приложения
./deploy.sh update

# Создание резервной копии БД
./deploy.sh backup

# Восстановление БД
./deploy.sh restore backup_file.sql

# Очистка (удаление всех контейнеров и образов)
./deploy.sh clean
```

### Команды для разработки

```bash
# Запуск в режиме разработки
./deploy-dev.sh

# Просмотр логов backend
./deploy-dev.sh logs_backend

# Просмотр логов frontend
./deploy-dev.sh logs_frontend

# Подключение к базе данных
./deploy-dev.sh db_connect

# Сброс базы данных
./deploy-dev.sh db_reset
```

## 🌐 Доступ к приложению

После успешного развёртывания:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Nginx (HTTPS)**: https://localhost
- **База данных**: localhost:5432

## 📊 Мониторинг

### Проверка статуса сервисов

```bash
# Статус всех контейнеров
docker-compose ps

# Логи в реальном времени
docker-compose logs -f

# Использование ресурсов
docker stats
```

### Health checks

- Frontend: `http://localhost:3000/health`
- Backend: `http://localhost:8000/api/health`
- Nginx: `https://localhost/health`

## 🔒 Безопасность

### Обязательные меры для продакшена

1. **Измените JWT_SECRET** на уникальный секретный ключ
2. **Используйте настоящие SSL сертификаты** (Let's Encrypt или коммерческие)
3. **Настройте файрвол** (UFW, iptables)
4. **Измените пароли базы данных** на сложные
5. **Настройте регулярные бэкапы**
6. **Обновите переменные окружения** для продакшена

### Пример .env для продакшена

```env
NODE_ENV=production
JWT_SECRET=your-very-long-and-random-secret-key-here
POSTGRES_PASSWORD=very-strong-password-with-special-chars
DOMAIN=your-production-domain.com
```

## 📦 Структура проекта

```
Onboarding/
├── docker-compose.yml          # Продакшн конфигурация
├── docker-compose.dev.yml      # Разработка конфигурация
├── deploy.sh                   # Скрипт развёртывания
├── deploy-dev.sh              # Скрипт разработки
├── nginx.conf                 # Nginx конфигурация
├── backend/
│   ├── Dockerfile             # Backend образ
│   ├── Dockerfile.dev         # Backend образ (разработка)
│   └── static/                # Статические файлы
├── frontend/
│   ├── Dockerfile             # Frontend образ
│   ├── Dockerfile.dev         # Frontend образ (разработка)
│   └── nginx.conf             # Frontend nginx
└── ssl/                       # SSL сертификаты
```

## 🚨 Устранение неполадок

### Частые проблемы

1. **Порт уже занят**
   ```bash
   # Проверьте, что порты свободны
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :3000
   ```

2. **Ошибки сборки Docker**
   ```bash
   # Очистите кэш Docker
   docker system prune -a
   ```

3. **Проблемы с базой данных**
   ```bash
   # Проверьте логи PostgreSQL
   docker-compose logs postgres
   ```

4. **SSL ошибки**
   ```bash
   # Проверьте сертификаты
   openssl x509 -in ssl/cert.pem -text -noout
   ```

### Логи и отладка

```bash
# Все логи
./deploy.sh logs

# Логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Логи в реальном времени
docker-compose logs -f backend
```

## 🔄 Обновление приложения

### Автоматическое обновление

```bash
# Обновление через скрипт
./deploy.sh update
```

### Ручное обновление

```bash
# Остановите приложение
./deploy.sh stop

# Обновите код
git pull origin main

# Пересоберите и запустите
docker-compose up --build -d
```

## 💾 Резервное копирование

### Автоматические бэкапы

```bash
# Создание бэкапа
./deploy.sh backup

# Восстановление из бэкапа
./deploy.sh restore backups/backup_20231201_120000.sql
```

### Настройка cron для автоматических бэкапов

```bash
# Добавьте в crontab
0 2 * * * cd /path/to/onboarding && ./deploy.sh backup
```

## 📈 Масштабирование

### Горизонтальное масштабирование

```bash
# Масштабирование backend
docker-compose up -d --scale backend=3

# Масштабирование с балансировщиком нагрузки
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
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

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `./deploy.sh logs`
2. Убедитесь, что все порты свободны
3. Проверьте переменные окружения
4. Очистите Docker кэш: `docker system prune -a`

## 📝 Лицензия

Этот проект распространяется под лицензией MIT. 