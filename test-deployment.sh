#!/bin/bash

# Скрипт для тестирования развёртывания Onboarding приложения
# Использование: ./test-deployment.sh

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

# Проверка статуса контейнеров
check_containers() {
    print_info "Проверка статуса контейнеров..."
    
    if docker-compose ps | grep -q "Up"; then
        print_success "Все контейнеры запущены"
        docker-compose ps
    else
        print_error "Не все контейнеры запущены"
        docker-compose ps
        exit 1
    fi
}

# Проверка доступности сервисов
check_services() {
    print_info "Проверка доступности сервисов..."
    
    # Проверка PostgreSQL
    if docker-compose exec -T postgres pg_isready -U onboarding_user; then
        print_success "PostgreSQL доступен"
    else
        print_error "PostgreSQL недоступен"
        return 1
    fi
    
    # Проверка Backend API
    if curl -f -s http://localhost:8000/api/health > /dev/null; then
        print_success "Backend API доступен"
    else
        print_error "Backend API недоступен"
        return 1
    fi
    
    # Проверка Frontend
    if curl -f -s http://localhost:3000 > /dev/null; then
        print_success "Frontend доступен"
    else
        print_error "Frontend недоступен"
        return 1
    fi
    
    # Проверка Nginx (если запущен)
    if docker-compose ps | grep -q "nginx.*Up"; then
        if curl -f -s -k https://localhost/health > /dev/null; then
            print_success "Nginx доступен"
        else
            print_warning "Nginx недоступен (возможно, SSL проблемы)"
        fi
    fi
}

# Проверка базы данных
check_database() {
    print_info "Проверка базы данных..."
    
    # Проверка подключения к БД
    if docker-compose exec -T postgres psql -U onboarding_user -d onboarding -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "Подключение к базе данных работает"
    else
        print_error "Не удалось подключиться к базе данных"
        return 1
    fi
    
    # Проверка таблиц
    TABLES=$(docker-compose exec -T postgres psql -U onboarding_user -d onboarding -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    
    if echo "$TABLES" | grep -q "users"; then
        print_success "Таблица users существует"
    else
        print_warning "Таблица users не найдена"
    fi
    
    if echo "$TABLES" | grep -q "tasks"; then
        print_success "Таблица tasks существует"
    else
        print_warning "Таблица tasks не найдена"
    fi
}

# Проверка API endpoints
check_api_endpoints() {
    print_info "Проверка API endpoints..."
    
    # Проверка health endpoint
    if curl -f -s http://localhost:8000/api/health | grep -q "OK"; then
        print_success "Health endpoint работает"
    else
        print_error "Health endpoint не работает"
        return 1
    fi
    
    # Проверка auth endpoints (должны возвращать 404 для GET без параметров)
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/auth/login | grep -q "404\|405"; then
        print_success "Auth endpoints доступны"
    else
        print_warning "Auth endpoints могут быть недоступны"
    fi
}

# Проверка статических файлов
check_static_files() {
    print_info "Проверка статических файлов..."
    
    # Проверка default-avatar.png
    if curl -f -s http://localhost:3000/default-avatar.png > /dev/null; then
        print_success "Default avatar доступен"
    else
        print_warning "Default avatar недоступен"
    fi
    
    # Проверка favicon
    if curl -f -s http://localhost:3000/favicon.ico > /dev/null; then
        print_success "Favicon доступен"
    else
        print_warning "Favicon недоступен"
    fi
}

# Проверка логов на ошибки
check_logs() {
    print_info "Проверка логов на ошибки..."
    
    # Проверка логов backend
    BACKEND_ERRORS=$(docker-compose logs backend 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
    if [ "$BACKEND_ERRORS" -eq 0 ]; then
        print_success "В логах backend нет ошибок"
    else
        print_warning "В логах backend найдено $BACKEND_ERRORS ошибок"
        docker-compose logs backend 2>&1 | grep -i "error\|exception\|fatal" | tail -5
    fi
    
    # Проверка логов frontend
    FRONTEND_ERRORS=$(docker-compose logs frontend 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
    if [ "$FRONTEND_ERRORS" -eq 0 ]; then
        print_success "В логах frontend нет ошибок"
    else
        print_warning "В логах frontend найдено $FRONTEND_ERRORS ошибок"
        docker-compose logs frontend 2>&1 | grep -i "error\|exception\|fatal" | tail -5
    fi
    
    # Проверка логов postgres
    POSTGRES_ERRORS=$(docker-compose logs postgres 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
    if [ "$POSTGRES_ERRORS" -eq 0 ]; then
        print_success "В логах postgres нет ошибок"
    else
        print_warning "В логах postgres найдено $POSTGRES_ERRORS ошибок"
        docker-compose logs postgres 2>&1 | grep -i "error\|exception\|fatal" | tail -5
    fi
}

# Проверка использования ресурсов
check_resources() {
    print_info "Проверка использования ресурсов..."
    
    echo "Использование ресурсов контейнерами:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# Основная функция тестирования
main() {
    print_info "Начинаем тестирование развёртывания..."
    
    # Проверяем, что docker-compose запущен
    if ! docker-compose ps > /dev/null 2>&1; then
        print_error "Docker Compose не запущен. Запустите сначала ./deploy.sh"
        exit 1
    fi
    
    # Выполняем все проверки
    check_containers
    check_services
    check_database
    check_api_endpoints
    check_static_files
    check_logs
    check_resources
    
    print_success "Тестирование завершено успешно!"
    print_info "Приложение готово к использованию:"
    print_info "  - Frontend: http://localhost:3000"
    print_info "  - Backend API: http://localhost:8000"
    print_info "  - База данных: localhost:5432"
}

# Запуск основной функции
main "$@" 