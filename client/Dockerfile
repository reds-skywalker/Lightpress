# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar manifiestos de dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar la app (Vite)
COPY . .
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa 'builder' hacia Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto por donde Nginx escucha por defecto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
