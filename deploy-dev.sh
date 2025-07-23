#!/bin/bash

# Скрипт для развёртывания Onboarding приложения в режиме разработки
# Использование: ./deploy-dev.sh [опция]

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

# Создание .env файла для разработки
create_env_file() {
    if [ ! -f .env.dev ]; then
        print_info "Создание .env.dev файла..."
        cat > .env.dev << EOF
# База данных (разработка)
POSTGRES_DB=onboarding_dev
POSTGRES_USER=onboarding_user
POSTGRES_PASSWORD=onboarding_password

# JWT секрет (разработка)
JWT_SECRET=dev-jwt-secret-key

# Порт для backend
BACKEND_PORT=8000

# Порт для frontend
FRONTEND_PORT=5173

# Домен (разработка)
DOMAIN=localhost

# Режим (development)
NODE_ENV=development
EOF
        print_success ".env.dev файл создан"
    else
        print_info ".env.dev файл уже существует"
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

# Сборка и запуск приложения в режиме разработки
deploy() {
    print_info "Начинаем развёртывание в режиме разработки..."
    
    # Останавливаем существующие контейнеры
    print_info "Остановка существующих контейнеров..."
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    
    # Собираем и запускаем
    print_info "Сборка и запуск контейнеров..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    # Ждём запуска сервисов
    print_info "Ожидание запуска сервисов..."
    sleep 15
    
    # Проверяем статус
    print_info "Проверка статуса сервисов..."
    docker-compose -f docker-compose.dev.yml ps
    
    print_success "Приложение развёрнуто в режиме разработки!"
    print_info "Frontend: http://localhost:5173"
    print_info "Backend API: http://localhost:8000"
    print_info "База данных: localhost:5432"
    print_info ""
    print_info "Для просмотра логов используйте: ./deploy-dev.sh logs"
    print_info "Для остановки используйте: ./deploy-dev.sh stop"
}

# Остановка приложения
stop() {
    print_info "Остановка приложения..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Приложение остановлено"
}

# Перезапуск приложения
restart() {
    print_info "Перезапуск приложения..."
    docker-compose -f docker-compose.dev.yml restart
    print_success "Приложение перезапущено"
}

# Просмотр логов
logs() {
    print_info "Просмотр логов..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Логи только backend
logs_backend() {
    print_info "Просмотр логов backend..."
    docker-compose -f docker-compose.dev.yml logs -f backend
}

# Логи только frontend
logs_frontend() {
    print_info "Просмотр логов frontend..."
    docker-compose -f docker-compose.dev.yml logs -f frontend
}

# Очистка (удаление контейнеров и образов)
clean() {
    print_warning "Это действие удалит все контейнеры, образы и данные разработки!"
    read -p "Вы уверены? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Очистка..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
        docker system prune -f
        print_success "Очистка завершена"
    else
        print_info "Очистка отменена"
    fi
}

# Подключение к базе данных
db_connect() {
    print_info "Подключение к базе данных..."
    docker-compose -f docker-compose.dev.yml exec postgres psql -U onboarding_user -d onboarding_dev
}

# Сброс базы данных
db_reset() {
    print_warning "Это действие удалит все данные из базы данных!"
    read -p "Вы уверены? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Сброс базы данных..."
        docker-compose -f docker-compose.dev.yml exec postgres psql -U onboarding_user -d onboarding_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
        print_success "База данных сброшена"
    else
        print_info "Сброс отменён"
    fi
}

# Резервное копирование базы данных
backup() {
    print_info "Создание резервной копии базы данных..."
    
    BACKUP_DIR="backups"
    BACKUP_FILE="backup_dev_$(date +%Y%m%d_%H%M%S).sql"
    
    mkdir -p $BACKUP_DIR
    
    docker-compose -f docker-compose.dev.yml exec -T postgres pg_dump -U onboarding_user onboarding_dev > "$BACKUP_DIR/$BACKUP_FILE"
    
    print_success "Резервная копия создана: $BACKUP_DIR/$BACKUP_FILE"
}

# Восстановление базы данных
restore() {
    if [ -z "$1" ]; then
        print_error "Укажите файл для восстановления: ./deploy-dev.sh restore backup_file.sql"
        exit 1
    fi
    
    print_info "Восстановление базы данных из $1..."
    
    if [ ! -f "$1" ]; then
        print_error "Файл $1 не найден"
        exit 1
    fi
    
    docker-compose -f docker-compose.dev.yml exec -T postgres psql -U onboarding_user onboarding_dev < "$1"
    
    print_success "База данных восстановлена"
}

# Показать справку
show_help() {
    echo "Скрипт для развёртывания Onboarding приложения в режиме разработки"
    echo ""
    echo "Использование: ./deploy-dev.sh [опция]"
    echo ""
    echo "Опции:"
    echo "  deploy        - Развернуть приложение (по умолчанию)"
    echo "  stop          - Остановить приложение"
    echo "  restart       - Перезапустить приложение"
    echo "  logs          - Показать все логи"
    echo "  logs_backend  - Показать логи backend"
    echo "  logs_frontend - Показать логи frontend"
    echo "  db_connect    - Подключиться к базе данных"
    echo "  db_reset      - Сбросить базу данных"
    echo "  backup        - Создать резервную копию БД"
    echo "  restore       - Восстановить БД из файла"
    echo "  clean         - Очистить все контейнеры и образы"
    echo "  help          - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  ./deploy-dev.sh           # Развернуть приложение"
    echo "  ./deploy-dev.sh logs      # Показать логи"
    echo "  ./deploy-dev.sh backup    # Создать бэкап"
    echo "  ./deploy-dev.sh restore backup_dev_20231201_120000.sql"
}

# Основная логика
main() {
    case "${1:-deploy}" in
        "deploy")
            check_dependencies
            create_env_file
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
        "logs_backend")
            logs_backend
            ;;
        "logs_frontend")
            logs_frontend
            ;;
        "db_connect")
            db_connect
            ;;
        "db_reset")
            db_reset
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