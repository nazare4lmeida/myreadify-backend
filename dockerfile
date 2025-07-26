# Usa imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta do app
EXPOSE 3333

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]
