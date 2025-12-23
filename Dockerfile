# Estágio de Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

# Estágio de Produção
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
# Copiar a pasta src/data para persistência inicial (se necessário)
COPY --from=builder /app/src/data ./src/data

# Criar pastas para uploads se não existirem
RUN mkdir -p uploads/members

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]
