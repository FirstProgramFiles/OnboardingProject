# Многоэтапная сборка для оптимизации размера
FROM node:18-alpine AS builder

# Устанавливаем зависимости для сборки
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libpng-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Продакшн образ
FROM node:18-alpine AS production

# Устанавливаем runtime зависимости
RUN apk add --no-cache \
    pixman \
    cairo \
    pango \
    libpng \
    jpeg \
    giflib \
    librsvg

WORKDIR /app

# Копируем node_modules и package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Копируем исходный код
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/static ./static

# Копируем сгенерированный Prisma клиент
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Создаём пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# Открываем порт
EXPOSE 8000

# Команда запуска
CMD ["npm", "start"] 