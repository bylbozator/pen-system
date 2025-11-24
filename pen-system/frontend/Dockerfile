# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Копируем только package.json сначала
COPY package.json ./

# Устанавливаем зависимости с флагами для совместимости
RUN npm install --silent --legacy-peer-deps

# Копируем остальной код
COPY . ./

# Собираем приложение
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем собранное приложение в nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомную конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]