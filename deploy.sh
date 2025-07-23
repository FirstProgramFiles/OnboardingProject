#!/bin/bash

# Скрипт для быстрого развёртывания Onboarding приложения
# Использование: ./deploy.sh [опция]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия Docker и Docker Compose
check_dependencies() {
    print_info "Проверка зависимостей..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose не установлен. Установите Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "Все зависимости установлены"
}

# Создание .env файла
create_env_file() {
    if [ ! -f .env ]; then
        print_info "Создание .env файла..."
        cat > .env << EOF
# База данных
POSTGRES_DB=onboarding
POSTGRES_USER=onboarding_user
POSTGRES_PASSWORD=onboarding_password

# JWT секрет (замените на свой)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Порт для backend
BACKEND_PORT=8000

# Порт для frontend
FRONTEND_PORT=3000

# Домен (замените на свой)
DOMAIN=localhost

# Режим (development/production)
NODE_ENV=production
EOF
        print_success ".env файл создан"
    else
        print_info ".env файл уже существует"
    fi
}

# Создание SSL сертификатов для разработки
create_ssl_certs() {
    if [ ! -d ssl ]; then
        print_info "Создание SSL сертификатов для разработки..."
        mkdir -p ssl
        
        # Генерируем самоподписанный сертификат
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem \
            -out ssl/cert.pem \
            -subj "/C=RU/ST=State/L=City/O=Organization/CN=localhost"
        
        print_success "SSL сертификаты созданы"
    else
        print_info "SSL сертификаты уже существуют"
    fi
}

# Создание директории для статических файлов
create_static_dir() {
    if [ ! -d backend/static ]; then
        print_info "Создание директории для статических файлов..."
        mkdir -p backend/static
        print_success "Директория static создана"
    fi
}

# Сборка и запуск приложения
deploy() {
    print_info "Начинаем развёртывание..."
    
    # Останавливаем существующие контейнеры
    print_info "Остановка существующих контейнеров..."
    docker-compose down --remove-orphans
    
    # Собираем и запускаем
    print_info "Сборка и запуск контейнеров..."
    docker-compose up --build -d
    
    # Ждём запуска сервисов
    print_info "Ожидание запуска сервисов..."
    sleep 10
    
    # Проверяем статус
    print_info "Проверка статуса сервисов..."
    docker-compose ps
    
    print_success "Приложение развёрнуто!"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend API: http://localhost:8000"
    print_info "Nginx (HTTPS): https://localhost"
}

# Остановка приложения
stop() {
    print_info "Остановка приложения..."
    docker-compose down
    print_success "Приложение остановлено"
}

# Перезапуск приложения
restart() {
    print_info "Перезапуск приложения..."
    docker-compose restart
    print_success "Приложение перезапущено"
}

# Просмотр логов
logs() {
    print_info "Просмотр логов..."
    docker-compose logs -f
}

# Очистка (удаление контейнеров и образов)
clean() {
    print_warning "Это действие удалит все контейнеры, образы и данные!"
    read -p "Вы уверены? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Очистка..."
        docker-compose down -v --rmi all --remove-orphans
        docker system prune -f
        print_success "Очистка завершена"
    else
        print_info "Очистка отменена"
    fi
}

# Обновление приложения
update() {
    print_info "Обновление приложения..."
    
    # Останавливаем контейнеры
    docker-compose down
    
    # Обновляем код (если используется git)
    if [ -d .git ]; then
        print_info "Обновление кода из git..."
        git pull origin main
    fi
    
    # Пересобираем и запускаем
    docker-compose up --build -d
    
    print_success "Приложение обновлено!"
}

# Резервное копирование базы данных
backup() {
    print_info "Создание резервной копии базы данных..."
    
    BACKUP_DIR="backups"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    mkdir -p $BACKUP_DIR
    
    docker-compose exec -T postgres pg_dump -U onboarding_user onboarding > "$BACKUP_DIR/$BACKUP_FILE"
    
    print_success "Резервная копия создана: $BACKUP_DIR/$BACKUP_FILE"
}

# Восстановление базы данных
restore() {
    if [ -z "$1" ]; then
        print_error "Укажите файл для восстановления: ./deploy.sh restore backup_file.sql"
        exit 1
    fi
    
    print_info "Восстановление базы данных из $1..."
    
    if [ ! -f "$1" ]; then
        print_error "Файл $1 не найден"
        exit 1
    fi
    
    docker-compose exec -T postgres psql -U onboarding_user onboarding < "$1"
    
    print_success "База данных восстановлена"
}

# Показать справку
show_help() {
    echo "Скрипт для развёртывания Onboarding приложения"
    echo ""
    echo "Использование: ./deploy.sh [опция]"
    echo ""
    echo "Опции:"
    echo "  deploy    - Развернуть приложение (по умолчанию)"
    echo "  stop      - Остановить приложение"
    echo "  restart   - Перезапустить приложение"
    echo "  logs      - Показать логи"
    echo "  update    - Обновить приложение"
    echo "  backup    - Создать резервную копию БД"
    echo "  restore   - Восстановить БД из файла"
    echo "  clean     - Очистить все контейнеры и образы"
    echo "  help      - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  ./deploy.sh           # Развернуть приложение"
    echo "  ./deploy.sh logs      # Показать логи"
    echo "  ./deploy.sh backup    # Создать бэкап"
    echo "  ./deploy.sh restore backup_20231201_120000.sql"
}

# Основная логика
main() {
    case "${1:-deploy}" in
        "deploy")
            check_dependencies
            create_env_file
            create_ssl_certs
            create_static_dir
            deploy
            ;;
        "stop")
            stop
            ;;
        "restart")
            restart
            ;;
        "logs")
            logs
            ;;
        "update")
            update
            ;;
        "backup")
            backup
            ;;
        "restore")
            restore "$2"
            ;;
        "clean")
            clean
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Неизвестная опция: $1"
            show_help
            exit 1
            ;;
    esac
}

# Запуск основной функции
main "$@" 