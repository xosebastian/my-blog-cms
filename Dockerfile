# Dockerfile

# Etapa base
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos y dependencias
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Exponer puerto de Next.js
EXPOSE 3000

# Iniciar la app en desarrollo
CMD ["npm", "run", "dev"]
