FROM node:20-alpine

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto de la API
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "src/index.js"]
